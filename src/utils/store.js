import create from "zustand"

const [useStore, { subscribe, getState, setState }] = create(
  (set, get, api) => ({
    advance: (type, key, callback) => {
      set(state => {
        const newValue = callback(state)
        return {
          ...state,
          [type]: {
            ...state[type],
            [key]: newValue,
          },
        }
      })
      return get()[type][key]
    },
    setInitialState: (type, initialState) => {
      set(state => {
        return {
          ...state,
          [type]: initialState,
        }
      })
    },
  })
)

export { useStore, subscribe, getState, setState }
