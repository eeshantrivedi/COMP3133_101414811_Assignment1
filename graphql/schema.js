
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
    created_at: Date
    updated_at: Date
  }

  type Query {
    # Login: provide username OR email along with password
    login(username: String, email: String, password: String!): AuthPayload!

    getAllEmployees: [Employee!]!
    searchEmployeeById(id: ID!): Employee
    searchEmployeesByDesignationOrDepartment(designation: String, department: String): [Employee!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!

    addEmployee(
      first_name: String!,
      last_name: String!,
      email: String!,
      gender: String,
      designation: String!,
      salary: Float!,
      date_of_joining: Date!,
      department: String!,
      employee_photo: String
    ): Employee!

    updateEmployee(
      id: ID!,
      first_name: String,
      last_name: String,
      email: String,
      gender: String,
      designation: String,
      salary: Float,
      date_of_joining: Date,
      department: String,
      employee_photo: String
    ): Employee!

    deleteEmployee(id: ID!): String!
  }
`;

module.exports = typeDefs;
