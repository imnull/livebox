import { TRoomUser } from "~/libs/messager/type"

export const findUser = (id: string, users: TRoomUser[]) => {
    const user = users.find(u => u.id === id)
    return user || undefined
}