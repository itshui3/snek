const fetchFreshState = (list) => {

    let savedStates = list.map((setter) => {
        let cur_state
        setter((state) => {
            cur_state = state
            return state
        })
        return cur_state
    })
    console.log('savedStates', savedStates)
    return savedStates
}

export { fetchFreshState }