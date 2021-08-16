import { gql } from '@apollo/client'

const GET_SELF = gql`
    query Users {
        self {
            _id
            email
            name
            lastName
            fullName
            enabled
        }
    }
`

export default {
    query: {
        GET_SELF
    }
}
