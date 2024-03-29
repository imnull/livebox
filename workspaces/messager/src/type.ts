export type TMergeCommand<A extends TMessage, B extends TCommandExtra = null> = B extends null ? A : (A & B)

export type TCommandExtra = { command: string; _command_id?: any } | null

export type TCommandMap<C extends TCommandExtra = null> = C extends { command: string } ? { [key in C['command']]: TExtraCommand<C, key> } : never

export type TMessager<C extends TCommandExtra = null> = {
    getIdentity(): string
    getNamespace(): string
    joinGroup(...groups: string[]): void
    blockSender(...senders: string[]): void
    regist(mapper: TMessageCommandCallbackMap<C, TMessageInner>): void
    unregist(mapper: TMessageCommandCallbackMap<C, TMessageInner>): void
    emit(message: TMergeCommand<TMessage, C>): void
    send(msg: TMergeCommand<TMessage, C>): void
    close(): void
    onMessage?(message: TMergeCommand<TMessageInner, C>): void
}

export type TMessage = ({
    target: 'public'
} | {
    target: 'group'
    group: string
} | {
    target: 'private'
    receiver: string
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
    identity?: string
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


export type TExtraCommand<M extends TCommandExtra, C extends string> = M extends { command: C } ? M : null
// type TC = TExtraCommand<TRoomEnterCommand | TRoomEnterOKCommand, 'room-user-enter'>
// type TC2 = TExtraCommand<TRoomEnterCommand | TRoomEnterOKCommand, 'room-user-enter-ok'>

// export type TMessageCommandNames<T extends { command: string }> = T extends { command: infer C } ? C : never
export type TMessageCommandMap<C extends TCommandExtra, M extends TMessage = TMessage> = C extends { command: string } ? { [key in C['command']]: TMergeCommand<M, TExtraCommand<C, key>> } : {}
export type TMessageCommandCallbackMap<C extends TCommandExtra, M extends TMessage = TMessage> = C extends { command: string } ? { [key in C['command']]?: (msg: TMergeCommand<M, TExtraCommand<C, key>>) => void } : {}

// export type TMessageEventCallback<T extends TCommandExtra, E extends TMessage = TMessage, K extends keyof TMessageCommandMap<T, E> = never> = (command: K, callback: (msg: TMessageCommandMap<T, E>[K]) => void) => void

export type TGenerator = <
    G extends TMessagerConfig = TMessagerConfig,
    C extends TCommandExtra = null,
    T extends TMessager<C> = TMessager<C>
>(C: new (config: G & TMessagerCoreConfig) => T, maker: TCoreMaker<G>) => (config: G) => T

export type TGeneratorAsync = <
    G extends TMessagerConfig = TMessagerConfig,
    C extends TCommandExtra = null,
    T extends TMessager<C> = TMessager<C>
>(C: new (config: G & TMessagerCoreConfig) => T, maker: TCoreMakerAsync<G>) => (config: G) => Promise<T>


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

// type TIsNever<T> = [T] extends [never] ? true : false


// type TRecordNames<A extends { command: string }> = keyof A
// type TRemoveName<A, T> = A extends T ? never : A
// type TCleanCommand<A extends { command: string }> = { [key in TRemoveName<TRecordNames<A>, 'command'>]: A[key] }

// type TMerge<A extends { command: string }, B extends { command: string }> = (TCleanCommand<A> & TCleanCommand<B>) & { command: A['command'] | B['command'] }
// type TCommandMap2<C extends { command: string }> = { [key in C['command']]: C extends { command: key } ? C : never }

// type TCMD = TMerge<{ command: 'a', a: 1, aa: 2 }, { command: 'b', b: 2 }>

// const cmd: TCMD

// const map: TCommandMap2<{ command: 'a', a: 1, aa: 2 } | { command: 'b', b: 2 }>

// type TCb<C extends { command: string }> = (cmd: C['command'], cb: (msg: C extends { command: typeof cmd } ? C : never) => void) => void

// const cb: TCb<{ command: 'a', a: 1, aa: 2 } | { command: 'b', b: 2 }>

// cb('a', msg => {
//     if(msg.command === 'a') {
//         msg.
//     }
// })

// type TA = { command: 'a', a: 0 }
// type TB = { command: 'b', b: 1 }

// const msg: TMessager<TA | TB>

// msg.regist({
//     'a': msg => {
        
//     },
//     b: msg => {
//         console.log(msg.b)
//     }
// })