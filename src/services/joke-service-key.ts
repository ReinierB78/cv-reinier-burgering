import type { InjectionKey } from 'vue'
import type { JokeService } from './joke-service'

export const JokeServiceKey: InjectionKey<JokeService> = Symbol('JokeService')
