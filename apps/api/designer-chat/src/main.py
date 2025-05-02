from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

import os
import uvicorn
import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain.globals import set_debug
from fastapi.responses import JSONResponse
from .formConfigurationStore import CosmosFormStore

# Initialize FastAPI app
app = FastAPI()
formStore = CosmosFormStore()

# Configure allowed origins from environment variable
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Only allow origins specified in the environment variable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to check origin and return 404 if not allowed
@app.middleware("http")
async def check_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    print(f"request.url", request.url)
    print(f"Origin: {origin}")
    print(f"Allowed Origins: {allowed_origins}")
    if not origin and "health" not in request.url.path:
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
    if origin and origin not in allowed_origins:
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
    return await call_next(request)

# Define request and response models
class ChatRequest(BaseModel):
    prompt: str
    formId: str

def remove_null_properties(json_string):
    # Parse the JSON string into a dictionary
    data = json.loads(json_string)
    
    # Recursively remove null properties
    def remove_nulls(obj):
        if isinstance(obj, dict):
            return {k: remove_nulls(v) for k, v in obj.items() if v is not None}
        elif isinstance(obj, list):
            return [remove_nulls(item) for item in obj]
        else:
            return obj

    cleaned_data = remove_nulls(data)
    
    # Convert the dictionary back to a JSON string
    return json.dumps(cleaned_data)

system_prompt = """
    You are a helpful assistant that generates form configurations based on the users input.
    The general structure of the form is as follows:

    {{
        "formId": "form id here",
        "title": "title here",
        "description": "description here",
        "startPage": "name of the first page id here",
        "pages": [
            {{
                "pageId": "what-is-your-name",
                "pageType": "default",
                "components": [
                    {{
                        "questionId": "1",
                        "type": "text",
                        "label": "What is your name?",
                        "name": "what_is_your_name",
                        "labelIsPageTitle": true
                    }}
                ],
                "conditions": [
                    {{
                        "id": "bXPPa-IGJuyc_yJ9E1Uxm",
                        "label": "no",
                        "expression": "Data.answer == \"no\"",
                        "nextPageId": "why-no"
                    }}
                ]
                "nextPageId": "summary"
            }},
            {{
                "pageId": "summary",
                "title": "Check your answers before sending your application",
                "pageType": "summary",                
                "components": [
                    {{
                        "type": "summary"
                    }},
                    {{
                        "type": "html",
                        "content": "<h2 class=\"govuk-heading-m\">Now send your application</h2><p class=\"govuk-body\">By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.</p>"
                    }}
                ]
            }}
        ],
        "submission": {{
            "method": "POST",
            "endpoint": "https://api.example.com/submit",
            "headers": {{
                "Content-Type": "application/json"
            }}
        }}
    }}
    
    Every form will have a "summary" page. The summary page will always be the last page in the form.
    The summary page will always have a "summary" component and a "html" component.

    The form can contain different components. The components are:
        text, select, multilineText, radio, checkbox, yesno, email, phonenumber, fileupload, dateparts, ukaddress
    
    Example of text, multilineText, yesno, email, phonenumber, fileupload, dateparts, ukaddress components:
    {{
        "questionId": "1",
        "type": "text",
        "label": "What is your name?",
        "name": "what_is_your_name",
        "labelIsPageTitle": true,
        "validationRules": [
            {{
                "id": "vr1",
                "expression": "Data.what_is_your_name != null && Data.what_is_your_name.Trim() != \"\" ",
                "errorMessage": "Enter your name"
            }}
        ]
    }}

    Example of the select, radio, checkbox components:
    {{
        "questionId": "2",
        "type": "select",
        "label": "Choose your favorite color",
        "name": "favorite_color",
        "options": [
            {{"value": "red", "label": "Red"}},
            {{"value": "blue", "label": "Blue"}},
            {{"value": "green", "label": "Green"}}
        ],
        "labelIsPageTitle": false,
        "validationRules": [
            {{
                "id": "vr3",
                "expression": "Data.favorite_color != null",
                "errorMessage": "Please select a color"
            }}
        ]
    }}

    Your answer will be, and only ever be, a JSON object with the following structure:
    {{
        "response": "<any helpful response you have>",
        "form": {{ <JSON object with the form configuration> }}
    }}

    Do not wrap the response in any formatting or code blocks. Do not add any additional text or explanation outside of the JSON.
    If the question is not about forms or changing configuration, put "I can only help with form configuration. I cannot help with anything else." in the JSON response.
    If the user asks to add a question without a pageId, assume they want to add a new page.
    If anything else about the question is not clear, ask for clarification. Do not make assumptions about what the user wants and do not offer a new configuration.
    Do not ever respond with a sample form configuration, only give a response to a form they have asked for.

    The user is potentially changing: {form}
    The user wants the configuration for: {input}
    
    """

llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("user", ["{form}","{input}"])
])
output_parser = StrOutputParser()
chain = prompt | llm | output_parser

# Root endpoint for testing
@app.get("/health")
def health():
    return {"message": "API is running"}

@app.post("/humphrey/chat", response_model=None)
def chat(request: ChatRequest):
    
    prompt = request.prompt
    form = {}
    
    try:
        form = formStore.read_config(request.formId)
    except Exception as e:
        # ignore
        pass
    
    cleaned_form = remove_null_properties(json.dumps(form))

    assistant_response = chain.invoke({"form": cleaned_form, "input": prompt})
    print(assistant_response)
    return assistant_response

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)