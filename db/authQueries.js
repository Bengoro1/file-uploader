import prisma from './prisma.js';

export const findByUsername = async (username) => await prisma.user.findUnique({where: {username}});

export const findById = async (id) => await prisma.user.findUnique({where: {id}});

export const createUser = async (firstName, lastName, email, username, hashedPassword) => {
  await prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      ...(email ? {email: email} : {}),
      username: username,
      password: hashedPassword
    },
  });
};