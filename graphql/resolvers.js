
const { GraphQLScalarType, Kind } = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');


const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";


const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom Date scalar type',
  parseValue(value) {
    return new Date(value); 
  },
  serialize(value) {
    return value.toISOString(); 
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const resolvers = {
  Date: dateScalar,
 
  User: {
    id: (parent) => parent._id.toString(),
  },
  Query: {
    
    login: async (_, { username, email, password }) => {
      try {
        let user;
        if (username) {
          user = await User.findOne({ username });
        } else if (email) {
          user = await User.findOne({ email });
        }
        if (!user) {
          throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
      } catch (error) {
        throw new Error(error.message);
      }
    },

 
    getAllEmployees: async () => {
      try {
        const employees = await Employee.find();
        return employees;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    
    searchEmployeeById: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error("Employee not found");
        }
        return employee;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    
    searchEmployeesByDesignationOrDepartment: async (_, { designation, department }) => {
      try {
        const filter = {};
        if (designation) filter.designation = designation;
        if (department) filter.department = department;
        const employees = await Employee.find(filter);
        return employees;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    
    signup: async (_, { username, email, password }) => {
      try {
        
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
          throw new Error("User already exists");
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
          username,
          email,
          password: hashedPassword,
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    
    addEmployee: async (_, args, context) => {
      
      try {
        if (args.salary < 1000) {
          throw new Error("Salary must be at least 1000");
        }
        const employee = new Employee(args);
        await employee.save();
        return employee;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    
    updateEmployee: async (_, { id, ...updates }, context) => {
      
      try {
        updates.updated_at = new Date();
        const employee = await Employee.findByIdAndUpdate(id, updates, { new: true });
        if (!employee) {
          throw new Error("Employee not found");
        }
        return employee;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    
    deleteEmployee: async (_, { id }, context) => {
      try {
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
          throw new Error("Employee not found");
        }
        return "Employee deleted successfully";
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
