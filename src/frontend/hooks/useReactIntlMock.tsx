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

export const useIntl = (message:Message) => {
    function FormattedMessage(parentMessage:Message){
        return parentMessage.defaultMessage
    }
    
    return {
        FormattedMessage: FormattedMessage(message)
    }
}