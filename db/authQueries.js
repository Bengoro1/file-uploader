import prisma from './prisma.js';

const findByUsername = async (username) => {
  await prisma.user.findUnique({
    where: {
      username: username
    },
  });
};

const createUser = async (firstName, lastName, email, username, hashedPassword) => {
  await prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: username,
      password: hashedPassword
    },
  });
};

const db = {findByUsername, createUser};

export default db;