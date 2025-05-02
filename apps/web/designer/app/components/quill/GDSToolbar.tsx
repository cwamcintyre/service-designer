const formats = [
    [
        { className: "ql-bold", value: "bold" },
        { className: "ql-italic", value: "italic" },
        { className: "ql-underline", value: "underline" }
    ],
    [
        { className: "ql-link", value: "link" }
    ]
]

const renderSingle = (formatData: any)=>{
    const {className,value} = formatData;
    return (
        <button className = {className} value = {value} key={value}></button>
    )
}

const CustomToolbar = () => (
    <div id="toolbar">
        {
            formats.map(classes => {
                return (
                    <span className = "ql-formats">
                        {
                            classes.map(formatData => {
                                return renderSingle(formatData)
                            })
                        }
                    </span>
                )
            })
        }
        <span className="ql-formats">
            <button className="ql-GdsHeaderOne" value="headerone" type="button"><svg viewBox="0 0 18 18"><path className="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"></path></svg></button>
            <button className="ql-GdsHeaderTwo" value="headertwo" type="button"><svg viewBox="0 0 18 18"><path className="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"></path></svg></button>
            <button className="ql-GdsHeaderThree" value="headerthree" type="button"><svg viewBox="0 0 18 18"><path className="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"></path></svg></button>
        </span>
        <span className="ql-formats">
            <button className="ql-GdsNumbers" value="ordered" type="button" aria-pressed="false">
                <svg viewBox="0 0 18 18">
                    <line className="ql-stroke" x1="7" x2="15" y1="4" y2="4"></line>
                    <line className="ql-stroke" x1="7" x2="15" y1="9" y2="9"></line>
                    <line className="ql-stroke" x1="7" x2="15" y1="14" y2="14"></line>
                    <line className="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"></line>
                    <path className="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"></path>
                    <path className="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"></path>
                    <path className="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"></path>
                </svg>
            </button>
            <button className="ql-GdsBullets" value="bullet" type="button" aria-pressed="false">
                <svg viewBox="0 0 18 18">
                    <line className="ql-stroke" x1="6" x2="15" y1="4" y2="4"></line>
                    <line className="ql-stroke" x1="6" x2="15" y1="9" y2="9"></line>
                    <line className="ql-stroke" x1="6" x2="15" y1="14" y2="14"></line>
                    <line className="ql-stroke" x1="3" x2="3" y1="4" y2="4"></line>
                    <line className="ql-stroke" x1="3" x2="3" y1="9" y2="9"></line>
                    <line className="ql-stroke" x1="3" x2="3" y1="14" y2="14"></line>
                </svg>
            </button>
        </span>
    </div>
  )

export default CustomToolbar;
