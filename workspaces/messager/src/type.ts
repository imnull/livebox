export type TMessager<C extends TCommandExtra = never> = {
    getIdentity(): string
    getNamespace(): string
    joinGroup(...groups: string[]): void
    blockSender(...senders: string[]): void
    regist(mapper: TMessageCommandCallbackMap<C, TMessageInner>): void
    emit(message: TMessage & C): void
    send(msg: TMessage & C): void
    close(): void
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
    onReady?: <C extends TCommandExtra = never>(messager: TMessager<C>) => void
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

export type TCommandExtra = { command: string }

export type TExtraCommand<M extends { command: string }, C extends M['command']> = M extends { command: C } ? M : never
// type TC = TExtraCommand<TRoomEnterCommand | TRoomEnterOKCommand, 'room-user-enter'>
// type TC2 = TExtraCommand<TRoomEnterCommand | TRoomEnterOKCommand, 'room-user-enter-ok'>

export type TMessageCommandNames<T extends { command: string }> = T extends { command: infer C } ? C : never
export type TMessageCommandMap<T extends { command: string }, E extends TMessage = TMessage> = { [key in T['command']]: TExtraCommand<T, key> & E }
export type TMessageCommandCallbackMap<T extends { command: string }, E extends TMessage = TMessage> = { [key in T['command']]?: (msg: TExtraCommand<T, key> & E) => void }