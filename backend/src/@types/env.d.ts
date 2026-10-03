/* eslint-disable no-unused-vars */

declare namespace NodeJS {
    export interface ProcessEnv {
        MAILTRAP_HOST: string
        MAILTRAP_PORT: number
        MAILTRAP_USERNAME: string
        MAILTRAP_PASSWORD:string
        STORAGE_DRIVER?: 'local' | 's3'
        APP_URL?: string
        LOCAL_UPLOADS_DIR?: string
        S3_ENDPOINT?: string
        S3_REGION?: string
        S3_BUCKET?: string
        S3_ACCESS_KEY_ID?: string
        S3_SECRET_ACCESS_KEY?: string
        S3_FORCE_PATH_STYLE?: string
        S3_PUBLIC_URL?: string
    }
  }
