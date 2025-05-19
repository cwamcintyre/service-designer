type SharedState = {
    serviceTitle?: string;
};

let sharedState: SharedState = {};

// Function to set shared data
export function setSharedState(data: SharedState) {
    sharedState = { ...sharedState, ...data };
}

// Function to get shared data
export function getSharedState(): SharedState {
    return sharedState;
}