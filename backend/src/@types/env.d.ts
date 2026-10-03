/* eslint-disable no-unused-vars */

declare namespace NodeJS {
    export interface ProcessEnv {
        MAILTRAP_HOST: string
        MAILTRAP_PORT: number
        MAILTRAP_USERNAME: string
        MAILTRAP_PASSWORD:string
    }
  }