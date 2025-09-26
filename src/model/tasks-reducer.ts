import {v1} from 'uuid'
import type {Task, TasksState} from '../app/App.tsx'
import {createTodolistAC, CreateTodolistAction, deleteTodolistAC, DeleteTodolistAction} from './todolists-reducer'
import {createAction, createReducer, nanoid} from "@reduxjs/toolkit";

const initialState: TasksState = {}

export const createTaskAC = createAction('tasks/createTask', (title: string, todolistId: string) => {
    return {payload: {title, id: nanoid(), todolistId}}
})
export const tasksReducer = createReducer(initialState, builder => {
    builder
        .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.id]
    })
        .addCase(createTodolistAC,(state, action)=>{
          state[action.payload.id]=[]
        })
        .addCase(createTaskAC,(state, action)=>{

            state[action.payload.todolistId].push({id: nanoid(), title:action.payload.title, isDone: false})

        })



})

export const tasksReducer2 = (state: TasksState = initialState, action: Actions): TasksState => {
    debugger
    switch (action.type) {
        case 'delete_task': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(task => task.id !== action.payload.taskId)
            }
        }
        case 'create_task': {
            const newTask: Task = {title: action.payload.title, isDone: false, id: v1()}
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
        }
        case "change_task_status": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(task => task.id === action.payload.taskId ? {
                    ...task,
                    isDone: action.payload.isDone
                } : task)
            }
        }
        case "change_task_title": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(task => task.id === action.payload.taskId ? {
                    ...task,
                    title: action.payload.title
                } : task)
            }
        }

        default:
            return state
    }
}

export const deleteTaskAC = (payload: { todolistId: string, taskId: string }) => {
    return {type: 'delete_task', payload} as const
}
//
// export const createTaskAC = (payload: { todolistId: string, title: string }) => {
//     return {type: 'create_task', payload} as const
// }

export const changeTaskStatusAC = (payload: { todolistId: string, taskId: string, isDone: boolean }) => {
    return {type: 'change_task_status', payload} as const
}

export const changeTaskTitleAC = (payload: { todolistId: string, taskId: string, title: string }) => {
    return {type: 'change_task_title', payload} as const
}

export type DeleteTaskAction = ReturnType<typeof deleteTaskAC>
export type CreateTaskAction = ReturnType<typeof createTaskAC>
export type ChangeTaskStatusAction = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleAction = ReturnType<typeof changeTaskTitleAC>

type Actions =
    | DeleteTaskAction
    | CreateTaskAction
    | ChangeTaskStatusAction
    | ChangeTaskTitleAction
