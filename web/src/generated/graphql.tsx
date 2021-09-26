import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type BookRating = {
  __typename?: 'BookRating';
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['String'];
  id: Scalars['String'];
  rating?: Maybe<Scalars['Int']>;
  status: BookStatus;
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  volumeId: Scalars['String'];
};

export type BookRatingInput = {
  rating?: Maybe<Scalars['Int']>;
  status: BookStatus;
  title: Scalars['String'];
  volumeId: Scalars['String'];
};

export type BookRatingResponse = {
  __typename?: 'BookRatingResponse';
  errors?: Maybe<Array<FieldError>>;
  item?: Maybe<BookRating>;
};

export enum BookStatus {
  Complete = 'COMPLETE',
  Current = 'CURRENT',
  Drop = 'DROP',
  Hold = 'HOLD',
  Plan = 'PLAN'
}

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBookRating: BookRatingResponse;
  deleteBookRating: Scalars['Boolean'];
  editBookRating: BookRatingResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
};


export type MutationCreateBookRatingArgs = {
  bookRatingInput: BookRatingInput;
};


export type MutationDeleteBookRatingArgs = {
  volumeId: Scalars['String'];
};


export type MutationEditBookRatingArgs = {
  bookRatingInput: BookRatingInput;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getBookRating?: Maybe<BookRating>;
  getUserById: UserResponse;
  me?: Maybe<User>;
};


export type QueryGetBookRatingArgs = {
  volumeId: Scalars['String'];
};


export type QueryGetUserByIdArgs = {
  userId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  bookRatings: Array<BookRating>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  item?: Maybe<User>;
};

export type CreateBookRatingMutationVariables = Exact<{
  input: BookRatingInput;
}>;


export type CreateBookRatingMutation = { __typename?: 'Mutation', createBookRating: { __typename?: 'BookRatingResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, item?: Maybe<{ __typename?: 'BookRating', id: string, volumeId: string, title: string, rating?: Maybe<number>, status: BookStatus, creatorId: string }> } };

export type DeleteBookRatingMutationVariables = Exact<{
  volumeId: Scalars['String'];
}>;


export type DeleteBookRatingMutation = { __typename?: 'Mutation', deleteBookRating: boolean };

export type EditBookRatingMutationVariables = Exact<{
  editInput: BookRatingInput;
}>;


export type EditBookRatingMutation = { __typename?: 'Mutation', editBookRating: { __typename?: 'BookRatingResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, item?: Maybe<{ __typename?: 'BookRating', id: string, volumeId: string, title: string, rating?: Maybe<number>, status: BookStatus, creatorId: string }> } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, item?: Maybe<{ __typename?: 'User', id: string, email: string }> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, item?: Maybe<{ __typename?: 'User', id: string, email: string }> } };

export type GetBookRatingQueryVariables = Exact<{
  volumeId: Scalars['String'];
}>;


export type GetBookRatingQuery = { __typename?: 'Query', getBookRating?: Maybe<{ __typename?: 'BookRating', id: string, volumeId: string, title: string, rating?: Maybe<number>, status: BookStatus, creatorId: string }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', id: string, email: string }> };


export const CreateBookRatingDocument = gql`
    mutation CreateBookRating($input: BookRatingInput!) {
  createBookRating(bookRatingInput: $input) {
    errors {
      field
      message
    }
    item {
      id
      volumeId
      title
      rating
      status
      creatorId
    }
  }
}
    `;
export type CreateBookRatingMutationFn = Apollo.MutationFunction<CreateBookRatingMutation, CreateBookRatingMutationVariables>;

/**
 * __useCreateBookRatingMutation__
 *
 * To run a mutation, you first call `useCreateBookRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBookRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBookRatingMutation, { data, loading, error }] = useCreateBookRatingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBookRatingMutation(baseOptions?: Apollo.MutationHookOptions<CreateBookRatingMutation, CreateBookRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBookRatingMutation, CreateBookRatingMutationVariables>(CreateBookRatingDocument, options);
      }
export type CreateBookRatingMutationHookResult = ReturnType<typeof useCreateBookRatingMutation>;
export type CreateBookRatingMutationResult = Apollo.MutationResult<CreateBookRatingMutation>;
export type CreateBookRatingMutationOptions = Apollo.BaseMutationOptions<CreateBookRatingMutation, CreateBookRatingMutationVariables>;
export const DeleteBookRatingDocument = gql`
    mutation DeleteBookRating($volumeId: String!) {
  deleteBookRating(volumeId: $volumeId)
}
    `;
export type DeleteBookRatingMutationFn = Apollo.MutationFunction<DeleteBookRatingMutation, DeleteBookRatingMutationVariables>;

/**
 * __useDeleteBookRatingMutation__
 *
 * To run a mutation, you first call `useDeleteBookRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBookRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBookRatingMutation, { data, loading, error }] = useDeleteBookRatingMutation({
 *   variables: {
 *      volumeId: // value for 'volumeId'
 *   },
 * });
 */
export function useDeleteBookRatingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBookRatingMutation, DeleteBookRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBookRatingMutation, DeleteBookRatingMutationVariables>(DeleteBookRatingDocument, options);
      }
export type DeleteBookRatingMutationHookResult = ReturnType<typeof useDeleteBookRatingMutation>;
export type DeleteBookRatingMutationResult = Apollo.MutationResult<DeleteBookRatingMutation>;
export type DeleteBookRatingMutationOptions = Apollo.BaseMutationOptions<DeleteBookRatingMutation, DeleteBookRatingMutationVariables>;
export const EditBookRatingDocument = gql`
    mutation EditBookRating($editInput: BookRatingInput!) {
  editBookRating(bookRatingInput: $editInput) {
    errors {
      field
      message
    }
    item {
      id
      volumeId
      title
      rating
      status
      creatorId
    }
  }
}
    `;
export type EditBookRatingMutationFn = Apollo.MutationFunction<EditBookRatingMutation, EditBookRatingMutationVariables>;

/**
 * __useEditBookRatingMutation__
 *
 * To run a mutation, you first call `useEditBookRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditBookRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editBookRatingMutation, { data, loading, error }] = useEditBookRatingMutation({
 *   variables: {
 *      editInput: // value for 'editInput'
 *   },
 * });
 */
export function useEditBookRatingMutation(baseOptions?: Apollo.MutationHookOptions<EditBookRatingMutation, EditBookRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditBookRatingMutation, EditBookRatingMutationVariables>(EditBookRatingDocument, options);
      }
export type EditBookRatingMutationHookResult = ReturnType<typeof useEditBookRatingMutation>;
export type EditBookRatingMutationResult = Apollo.MutationResult<EditBookRatingMutation>;
export type EditBookRatingMutationOptions = Apollo.BaseMutationOptions<EditBookRatingMutation, EditBookRatingMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      field
      message
    }
    item {
      id
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password) {
    errors {
      field
      message
    }
    item {
      id
      email
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const GetBookRatingDocument = gql`
    query GetBookRating($volumeId: String!) {
  getBookRating(volumeId: $volumeId) {
    id
    volumeId
    title
    rating
    status
    creatorId
  }
}
    `;

/**
 * __useGetBookRatingQuery__
 *
 * To run a query within a React component, call `useGetBookRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookRatingQuery({
 *   variables: {
 *      volumeId: // value for 'volumeId'
 *   },
 * });
 */
export function useGetBookRatingQuery(baseOptions: Apollo.QueryHookOptions<GetBookRatingQuery, GetBookRatingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookRatingQuery, GetBookRatingQueryVariables>(GetBookRatingDocument, options);
      }
export function useGetBookRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookRatingQuery, GetBookRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookRatingQuery, GetBookRatingQueryVariables>(GetBookRatingDocument, options);
        }
export type GetBookRatingQueryHookResult = ReturnType<typeof useGetBookRatingQuery>;
export type GetBookRatingLazyQueryHookResult = ReturnType<typeof useGetBookRatingLazyQuery>;
export type GetBookRatingQueryResult = Apollo.QueryResult<GetBookRatingQuery, GetBookRatingQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;