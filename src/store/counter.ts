import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const widgetList = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
    },
    reducers: {
        incremented: state => {
            state.value += 1
        },
        decremented: state => {
            state.value -= 1
        },
        amountAdd: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        }
    }
})

export const { incremented, decremented } = widgetList.actions

export default widgetList.reducer
