import { csrfFetch } from './csrf';

const LOAD_SPOT = "spots/LOAD_SPOT";
const LOAD_SINGLE_SPOT = "spots/LOAD_SINGLE_SPOT"
const ADD_SPOT = "spots/ADD_SPOT"
const EDIT_SPOT = "spots/editSpot";
const DELETE_SPOT = "spots/deleteSpot";

export const loadSpotsAction = (spots) => ({
  type: LOAD_SPOT,
  spots
});

export const loadSingleSpotAction = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    spot
})

export const addSpotAction = (spot) => ({
    type: ADD_SPOT,
    spot
})
  
  export const removeSpotAction = (spotId) => ({
    type: DELETE_SPOT,
    spotId
  });

//Thunk that GETs all the users of spots
export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const spotData = await response.json();
    await dispatch(loadSpotsAction(spotData));
    return spotData;
  };
};

//thunk that GETs detailed information about one spot
export const getSingleSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
      const spotData = await response.json();
      await dispatch(loadSingleSpotAction(spotData));
      return spotData;
    };
  };

//thunk that ADDs spots
export const addSpotThunk = (newSpot, spotImages) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSpot)
    });
    if (res.ok) {
      const spot = await res.json();
      await dispatch(addSpotAction(spot));
      for (let image of spotImages) {
        await csrfFetch(`/api/spots/${spot.id}/images`, {
          method: 'POST',
          body: JSON.stringify(image)
        });
      };
      return spot;
    };
  };

  export const deleteSpot = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (res.ok) {
      const data = await res.json();
      dispatch(removeSpotAction(id));
      return res
    };
  };

const initialState = {
  SpotsObject: {},
  singleSpotObject: {},
};

const spotsReducer = (state = initialState, action) => {

  switch (action.type) {
    case LOAD_SPOT: {

      const newState = {
        ...state,
        SpotsObject: { ...state.SpotsObject },
      };

      action.spots.Spots.map(spot => {
        newState.SpotsObject[spot.id] = spot
      });
      return newState;
    }
    case LOAD_SINGLE_SPOT: {
        const newState = { ...state };
        newState.singleSpotObject = { ...action.spot };
        return newState;
      }
    case ADD_SPOT: {
    const newState = {
            ...state,
            SpotsObject: { ...state.SpotsObject },
            singleSpotObject: { ...state.singleSpotObject }
        };
        newState.SpotsObject[action.spot.id] = action.spot;
        return newState;
        }

    case DELETE_SPOT: {
    const newState = {
        ...state,
        SpotsObject: {...state.SpotsObject},
        singleSpotObject: {...state.singleSpotObject},
    };
    delete newState.SpotsObject[action.spotId];
    delete newState.singleSpotObject[action.spotId];
    return newState;
    }
    default:
      return state;
  };
};

export default spotsReducer;