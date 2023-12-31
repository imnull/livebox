export type TMergeCommand<A extends TMessage, B extends TCommandExtra = null> = B extends null ? A : (A & B)

export type TCommandExtra = { command: string } | null

export type TCommandMap<C extends TCommandExtra = null> = C extends { command: string } ? { [key in C['command']]: TExtraCommand<C, key> } : never

export type TMessager<C extends TCommandExtra = null> = {
    getIdentity(): string
    getNamespace(): string
    joinGroup(...groups: string[]): void
    blockSender(...senders: string[]): void
    regist(mapper: TMessageCommandCallbackMap<C, TMessageInner>): void
    emit(message: TMergeCommand<TMessage, C>): void
    send(msg: TMergeCommand<TMessage, C>): void
    close(): void
    onMessage?(message: TMergeCommand<TMessageInner, C>): void
    on<K extends keyof TCommandMap<C>>(command: K, callback: (msg: TCommandMap<C>[K] & TMessageInner) => void): void
    off<K extends keyof TCommandMap<C>>(command: K, callback: any): void
}

export type TMessage = ({
    target: 'public'
} | {
    target: 'group'
    group: string
} | {
    target: 'private'
    reciever: string
})

export type TCommandHello = {
    command: 'hello'
}

export type TMessageInner = {
    sender: string
} & TMessage

export type TCoreMessager = {
    useCallback: (callback: (data: any) => void, sender: string) => void
    poseMessage: (data: any, sender: string) => void
    close: (sender: string) => void
    onReady?: <C extends TCommandExtra = null>(messager: TMessager<C>) => void
}

export type TCoreMaker<T extends TMessagerConfig = TMessagerConfig> = (config: T) => TCoreMessager
export type TCoreMakerAsync<T extends TMessagerConfig = TMessagerConfig> = (config: T) => Promise<TCoreMessager>

export type TMessagerCoreConfig = {
    core: TCoreMessager
}

export type TMessagerConfig = {
    uri?: string
    namespace?: string
    groups?: string[]
    blocks?: string[]
}


export type TExtraCommand<M extends { command: string }, C extends M['command']> = M extends { command: C } ? M : never
// type TC = TExtraCommand<TRoomEnterCommand | TRoomEnterOKCommand, 'room-user-enter'>
// type TC2 = TExtraCommand<TRoomEnterCommand | TRoomEnterOKCommand, 'room-user-enter-ok'>

// export type TMessageCommandNames<T extends { command: string }> = T extends { command: infer C } ? C : never
export type TMessageCommandMap<T extends TCommandExtra, E extends TMessage = TMessage> = T extends { command: string } ? { [key in T['command']]: TExtraCommand<T, key> & E } : {}
export type TMessageCommandCallbackMap<T extends TCommandExtra, E extends TMessage = TMessage> = T extends { command: string } ? { [key in T['command']]?: (msg: TExtraCommand<T, key> & E) => void } : {}

// export type TMessageEventCallback<T extends TCommandExtra, E extends TMessage = TMessage, K extends keyof TMessageCommandMap<T, E> = never> = (command: K, callback: (msg: TMessageCommandMap<T, E>[K]) => void) => void



// type TA = { type: 'a', a: 1 }
// type TB = { type: 'b', b: 1 }

// type TAB = TA | TB

// type TExtraAB<M extends { type: any }, C> = M extends { type: C } ? M : never
// type TABMap = { [key in TAB['type']]: TExtraAB<TAB, key> }

// type Filter<Obj extends Object, ValueType> = {
//     [Key in keyof Obj as ValueType extends Obj[Key] ? Key : never]: Obj[Key];
// }

// type TCallback = { (t: TAB['type']): void } extends { (type: infer T extends string): void } ? { (type: T, cb: (msg: TExtraAB<TAB, T>) => void): void } : never
// type TCallback2<T extends keyof TABMap> = { (t: T, cb: (o: TABMap[T]) => void): void }

// let cb: TCallback2<'a'>// & TCallback2<'b'>



// cb('a', o => {
//     o.type == ''
// })
