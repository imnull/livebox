export type TMessageSender = {
    sender: string
}

export type TMessageBase = ({
    target?: 'public'
} | {
    target: 'private'
    receiver: string
})

export type TMessage = TMessageBase & TMessageSender

type TLiveAnswer = {
    command: 'live-answer'
    answer: { sdp?: string; type: 'answer' }
}

type TLiveOffer = {
    command: 'live-offer'
    offer: { sdp?: string; type: 'offer' }
}

export type TExtraCommand<C extends { command: string }, K extends C['command']> = C extends { command: K } ? C : never

export type TMessager<C extends { command: string } = any> = {
    get id(): string
    on(events: { [key in C['command']]?: (msg: TExtraCommand<C, key> & TMessageBase & TMessageSender) => void }): void
    off(...names: C['command'][]): void
    send(msg: C & TMessageBase): void
    close(): void
}

type TMessagerOptions = {
    channel: string
}

export type TMessagerCore<C extends { command: string }> = {
    post(msg: C & TMessageBase & TMessageSender): void
    listen(callback: (msg: C & TMessageBase & TMessageSender) => void): void
    close(): void
    identity?: string
}