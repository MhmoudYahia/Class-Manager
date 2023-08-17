![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/e0fbac44-4c78-423d-8668-4bc2d328e35b)



# Class-Manager
This project is a Class Manager website built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It provides a platform for managing classes, students, and instructors. 

## 🧑🏼‍💻 Client  Tech Stack
- ReactJS
- React Redux
- reduxjs/toolkit
- Pug Templates (For Emails)
- Socket.io-Client
  
 ## 🧑🏼‍💻 Server  Tech Stack 
- NodeJS
- ExpressJs
- MongoDB 
- Mongoose
- Bcrypt.js
- JSON Web Tokens (JWT)

## Project Overview

This project is a robust web application designed to facilitate a seamless and secure experience for teachers and students in an educational setting. The application offers various authentication features, including login, sign up, forget password, and reset password forms.

Teachers and students can create accounts and specify their roles during the signup process. Teachers have enhanced functionalities compared to students, empowering them to effectively manage their classes, materials, quizzes, student submissions, marks, announcements, and interact with students.

The application provides teachers with the ability to create, edit, and delete classes, along with adding and managing materials within each class. They can also create quizzes, review student submissions, manage grading, and engage in real-time chat with students. Additionally, teachers can access student lists, view marks, and make necessary updates.

Students can enroll in classes, participate in quizzes, review their marks, and communicate with their teachers through the chat feature. They have access to their profiles, where they can update personal information and change their passwords.

The admin user has comprehensive privileges, including user management and class oversight. They can view and interact with all teachers and students, ensuring smooth communication and efficient administration.

To enhance user experience, the application implements user-friendly alerts throughout the website. These alerts provide valuable guidance, notifications, and feedback, ensuring smooth interaction and helping users navigate the platform effortlessly.

This project aims to streamline the educational process by providing a centralized platform for teachers and students to collaborate, access resources, assess learning, and communicate effectively. It offers a user-friendly interface, robust security measures, and an intuitive design to enhance the overall learning experience.

## Project Description
The application caters to two main user roles: teachers and students. During the signup process, users can specify their role as either a teacher or a student, determining the features and functionalities available to them within the application. Teachers enjoy additional capabilities compared to students, enabling them to perform various actions related to classroom management and content delivery.
 
### Authentication Functionality:
- Login: Users can securely log into their accounts.
- Sign Up: New users can create an account with specified roles (teacher or student).
- Forget Password: Users can initiate a password reset process by providing their registered email address.
- Reset Password: Users can securely reset their password after receiving an email with instructions.


### Teacher Functionality:

#### Classes:

- Teachers can create, edit, and delete classes. This feature allows them to organize their courses effectively.
- Within each class, teachers can add, modify, and remove materials, providing students with relevant resources.

#### Quizzes:

- Teachers can create quizzes for their classes, offering an interactive way to assess student knowledge.
- They have the ability to delete quizzes if necessary.
- Teachers can also view a list of student submissions for each quiz, enabling them to track student progress and performance.
#### Student Management:

- A tab is available for teachers to view a comprehensive list of students enrolled in their classes.
- Teachers can add students to their classes, ensuring proper enrollment and participation.
- Real-time chat functionality allows teachers to engage in direct communication with individual students.
- Similarly, teachers can access a list of all other teachers for collaborative purposes.
#### Marks and Grading:

- Teachers can view a dedicated tab displaying the marks and grades of students in their classes.
- They have the ability to add, delete, or edit individual student marks, ensuring accurate and up-to-date records.
#### Announcements:

- Teachers can create, edit, and delete announcements, providing important updates and information to students.
#### Profile:

- Teachers have a profile page where they can manage their personal information, including their name, email, and profile photo.
- Additionally, they can change their password for enhanced security.
- The profile page also offers access to all chat conversations with students and other teachers.
### Student Functionality:

#### Classes:

- Students can browse and view available classes.
- They have the ability to enroll or unenroll in classes using class-specific codes.
#### Quizzes:

- Students can participate in quizzes assigned by their teachers.
- Quizzes may include timers to ensure timely completion.
- After completing quizzes, students can view their marks and review the correct answers.
#### Student-Teacher Interaction:

- Students can engage in chat conversations with their teachers, facilitating communication and support.

#### Profile:

- Similar to teachers, students have a profile page where they can manage their personal information, including their name, email, and profile photo.
- They can also change their password for account security.
- The profile page provides access to all chat conversations with teachers.
### Admin Functionality:
- The admin has the authority to view all teachers and students registered within the application.
- They can engage in chat conversations with teachers and students as needed.
- The admin has unrestricted access to any class within the application, allowing them to oversee and manage all classes effectively.

### Another Features

#### Welcome Email:
New users receive a welcome email after signing up, providing a warm introduction to the platform and guiding them through the initial steps.
#### Email With The New Materials or Announcements:
Users receive an email with the new material that the teacher uploaded it to be familiar with new course materials. Also the new announcements.
#### User-Friendly Alerts:
Throughout the website, user-friendly alerts are implemented to provide guidance, notifications, and feedback, enhancing the overall user experience.


## JWT Authentication using Cookies

JWT (JSON Web Token) authentication is a popular method used for securing web applications and APIs. It allows for stateless authentication by using digitally signed tokens to validate and authorize user requests. While JWTs are typically stored in the client-side, using cookies for JWT storage offers additional security benefits. This document provides a brief overview of JWT authentication using cookies.

How JWT Authentication Works:

1. User Authentication: When a user logs in to an application, their credentials are verified by the server. If the credentials are valid, a JWT is generated and signed using a secret key known only to the server.

1. Token Issuance: The signed JWT is then sent back to the client as a response. It contains three parts: header, payload, and signature. The header specifies the signing algorithm used, while the payload contains claims (e.g., user ID, expiration time) about the user. The signature is created by hashing the header, payload, and secret key together.

1. Token Storage: In traditional JWT authentication, the client stores the JWT in local storage or session storage. However, to enhance security and prevent cross-site scripting (XSS) attacks, storing JWTs in cookies is a recommended approach.

JWT Authentication with Cookies:

1. Set Cookie: When the client receives the JWT, it is typically stored in an HTTP-only cookie. An HTTP-only cookie is inaccessible to JavaScript, making it more secure against XSS attacks. The cookie should have a secure flag set if the application is served over HTTPS.

1. Cookie Transmission: With each subsequent request, the client automatically includes the JWT as a cookie in the request headers. The server can access the JWT from the cookie and verify its authenticity by checking the signature using the secret key.

1. Token Expiration: The JWT includes an expiration time (exp), after which it becomes invalid. The server should verify the expiration time and deny access if the token has expired. If needed, the server can issue a new JWT by following the authentication process.

Benefits of JWT Authentication with Cookies:

1. Improved Security: Storing JWTs in HTTP-only cookies mitigates the risk of XSS attacks as they cannot be accessed by malicious JavaScript code.

1. Simplicity: Using cookies for JWT storage eliminates the need for developers to handle the complexities of client-side token storage.

1. Cross-Domain Requests: Cookies are automatically sent with cross-domain requests, allowing for seamless authentication across multiple subdomains or separate applications.

1. Token Revocation: If necessary, JWTs stored in cookies can be easily revoked by deleting the cookie on the server-side, preventing further access.

JWT authentication using cookies combines the benefits of JWTs with the enhanced security offered by HTTP-only cookies. By securely storing JWTs on the client-side, developers can ensure the integrity and confidentiality of user authentication while simplifying the implementation process. 

  
## API Reference

#### Get all items

```http
  GET /api/v1/classes
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` |You can get all classes;, create new ones, and edit and delete classes. There are also special endpoints for some special requirements.|



#### See Full API Documentation on Postman [here](https://documenter.getpostman.com/view/23936176/2s9Xy6pUw4)
<hr>

## 📱 Screenshots For Teacher UI
### Home Page 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/08a193d2-cd8a-4b90-a8af-86f2591cf5a8)
#### You Will Enter The Class After Creating, Or By Clicking On It. You Will Find Many Tabs
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/b3c7e211-620d-4baa-a1fe-96ac950852ab)

#### If The Teacher want to delete The Class (delete button Dialog)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/e5e2acad-e6d1-46f4-888a-4e5a9fac35ad)
### Material Tab 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/73997f02-e1e1-4dab-9313-39914654f16a)
### Quizs Tab
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/a02aa8e8-c2b6-41f8-9802-47973db27e5b)
#### if you  clicked on submissions button, you will see a Dialog with students submissions
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/ba906c73-3039-4db3-97c8-4faa9c8ea149)
#### Delete Dialog 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/0b92d7fe-a42f-41fc-93ac-3af72e975f9f)
#### Add Quiz Form 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/a91e31a8-dc08-4f7f-a917-32ac3debe58c)

### Students Marks Tab
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/aeaedb84-f704-455b-b31f-35d8f46304da)
#### Teacher can delete(Dialog like the last one) or edit the mark
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/42921ff4-3e53-4097-b2ed-4ea6de8b60ec)

### Teachers List Tab (Teacher can add another teacher) 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/4a209c74-10e5-482e-9273-22a10f635f2f)

### Students List Tab (Teacher can also add students by himself using there emails)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/64c192e1-8de6-4173-aee5-7ba5e222ed3e)

### Announcements Tab (Teacher can edit or delete the annoucement)

![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/66acf194-448e-454d-8de2-e8df100d5562)

<hr>

## 📱 Screenshots For Student UI
### Home Page (Enter the class code and enroll)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/a4096bd6-1d19-4cce-a9ea-5cf793c58965)
### Class Page With the Tabs
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/38f1c629-4ba8-451a-882e-c247e0dc2c24)
#### un Enroll Dialog 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/cc086490-9cac-4b69-ab1e-02b5af30dc6f)
### Quizs Tab
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/cc4bfc77-98ee-4726-961f-7bdf148cc7c4)
#### If you started the quiz
##### If you entered before you will see the final result, correct answers and also you answers
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/e838a78a-7ac3-4918-affd-3a93723d73e8)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/19c8efa1-1110-4008-b5f0-82ffc37dc9ab)
##### If it the first time to enter the quiz (answer before the timer closes the quiz over you :)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/91b494df-f947-40f1-9fad-bf239bc4865f)


### Student Marks
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/d120e769-61c0-4200-8779-b7573ce1e1c6)

### Annoucements
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/8e025de9-f273-4a4a-8de6-b98687047b80)

<hr>

## 📱 General Screenshots 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/41ce36a1-3f80-4731-8422-b9385d62a6bd)
 ###  Frofile page
 ![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/906c21b2-e277-4406-99dc-4777b56962d2)
### change Password Dialog Form
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/6ec62153-adeb-408a-9ef6-4f4fdff1d7cd)
### My Classes List
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/751cc2ae-d8a7-484f-b05f-3fa82d2e4e70)

### List Of My Marks
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/bfbe0c89-669c-4d9c-a461-885727ccf2bd)

### Real-Time Chats
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/50da20ca-f205-46d8-8dc1-bebf003ba5ac)

### Auth. Forms

![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/6a071ff9-a4c0-4e22-bf6a-7fd05493a7d9)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/b71a1397-ee43-4198-8180-cbe4ff725a69)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/aafd1c5a-2135-4f65-84bd-b5363f25cb56)
![image](https://github.com/MhmoudYahia/Natours-App/assets/94763036/22849469-d8a7-41b4-aa63-691e3323813d)
## Run Locally
Clone the project

```bash
  git clone https://github.com/MhmoudYahia/Natours-App.git
```

Install dependencies

```bash
  npm install
  cd /client
  npm install
```

Start the server

```bash
  npm run start:dev
```


## Authors

- [@MhmoudYahia](https://github.com/MhmoudYahia)


## Found a bug?

If you find any bugs in the projects not listed in the issues panel. Then feel free to create an issue regarding the bug.

## 🤖 Feedback

If you have any feedback, please reach out to me at myehia162@gmail.com
