import { createSlice, configureStore } from '@reduxjs/toolkit'

const pageIndexSlice = createSlice({
    name: 'pageIndex',
    initialState: {
        pageIndex: 0
    },
    reducers: {
      incremented: state => {
        
        state.pageIndex += 1
      },
      decremented: state => {
        state.pageIndex -= 1
      }
    }
  })
  
  export const { incremented, decremented } = pageIndexSlice.actions
  
  export const store = configureStore({
    reducer: pageIndexSlice.reducer
  })
  
  // Can still subscribe to the store
  // store.subscribe(() => console.log(store.getState()))
  
