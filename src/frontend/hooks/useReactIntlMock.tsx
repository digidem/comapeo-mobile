import { Text } from "react-native"

type Message = {
    id: string
    defaultMessage: string
    description: string
}

type Messages = {
    [name:string]:Message
}


export const defineMessages = (messages:Messages) => {
    return messages
}

export const FormattedMessage = (message:Message) => {
    return (
        <Text>
            {message.defaultMessage}
        </Text>
    )
}

export const useIntl = () => {

    return {
        formatMessage: (message:Message)=>{
            return message.defaultMessage
        }
    }
}