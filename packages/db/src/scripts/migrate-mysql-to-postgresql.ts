// import { db as dbMysql, schema as schemaMysql } from "@acme/db-mysql";

// import { db, schema } from "..";

// async function main() {
//   const accounts = await dbMysql.select().from(schemaMysql.accounts);
//   const users = await dbMysql.select().from(schemaMysql.users);
//   const sessions = await dbMysql.select().from(schemaMysql.sessions);
//   const verificationTokens = await dbMysql
//     .select()
//     .from(schemaMysql.verificationTokens);

//   const courses = await dbMysql.select().from(schemaMysql.courses);
//   const chapters = await dbMysql.select().from(schemaMysql.chapters);
//   const usersCourses = await dbMysql.select().from(schemaMysql.usersCourses);
//   const usersChaptersProgresses = await dbMysql
//     .select()
//     .from(schemaMysql.usersChaptersProgresses);
//   const attachments = await dbMysql.select().from(schemaMysql.attachments);
//   const categories = await dbMysql.select().from(schemaMysql.categories);
//   const categoriesCourses = await dbMysql
//     .select()
//     .from(schemaMysql.categoriesCourses);

//   for (const account of accounts) {
//     await db.insert(schema.accounts).values(account);
//   }

//   console.log("Inserted accounts");

//   for (const user of users) {
//     await db.insert(schema.users).values(user);
//   }

//   console.log("Inserted users");

//   for (const session of sessions) {
//     await db.insert(schema.sessions).values(session);
//   }

//   console.log("Inserted sessions");

//   for (const verificationToken of verificationTokens) {
//     await db.insert(schema.verificationTokens).values(verificationToken);
//   }

//   console.log("Inserted verificationTokens");

//   for (const course of courses) {
//     await db.insert(schema.courses).values(course);
//   }

//   console.log("Inserted courses");

//   for (const chapter of chapters) {
//     await db.insert(schema.chapters).values(chapter);
//   }

//   console.log("Inserted chapters");

//   for (const userCourse of usersCourses) {
//     await db.insert(schema.usersCourses).values(userCourse);
//   }

//   console.log("Inserted usersCourses");

//   for (const userChapterProgress of usersChaptersProgresses) {
//     await db.insert(schema.usersChaptersProgresses).values(userChapterProgress);
//   }

//   console.log("Inserted usersChaptersProgresses");

//   for (const attachment of attachments) {
//     await db.insert(schema.attachments).values(attachment);
//   }

//   console.log("Inserted attachments");

//   for (const category of categories) {
//     await db.insert(schema.categories).values(category);
//   }

//   console.log("Inserted categories");

//   for (const categoryCourse of categoriesCourses) {
//     await db.insert(schema.categoriesCourses).values(categoryCourse);
//   }

//   console.log("Inserted categoriesCourses");
// }

// main()
//   .then(() => {
//     console.log("Finished");
//   })
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
