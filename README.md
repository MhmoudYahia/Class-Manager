![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/932f5eb6-6320-478f-a8a3-9c5ea54537ed)




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
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/6de2bd25-d506-4fbf-b628-ebd402794f35)

#### You Will Enter The Class After Creating, Or By Clicking On It. You Will Find Many Tabs
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/ef1a9ac7-2741-4b0c-a0b3-53baef95c135)


#### If The Teacher want to delete The Class (delete button Dialog)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/2ba634e9-ee9c-4a56-b01f-269dafd2f16d)


### Material Tab 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/06e0f248-563f-422f-93bc-f33ea2676a93)

### Quizs Tab
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/4e3195ac-54f6-4780-afb5-0cafe7c7d3ac)

### If you  clicked on submissions button, you will see a Dialog with students submissions
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/3a6b6147-2651-4f1f-8be8-0b760a5b8ed3)

### Add Quiz Form 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/ed9a9d8e-6401-441e-b1fe-db08bc31e8ae)


### Students Marks Tab
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/585d932d-4aae-42d7-be5a-ccff6aef60db)

### Teacher can delete(Dialog like the last one) or edit the mark
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/7d9f284e-7c12-4f8d-afa9-f9399f691b6a)


### Teachers List Tab (Teacher can add another teacher) 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/6be4651e-edc8-43e4-86b7-42bdaadb60a3)


### Students List Tab (Teacher can also add students by himself using there emails)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/45e2845b-3021-49bd-b04e-5a92f9449ecb)


### Announcements Tab (Teacher can edit or delete the annoucement)

![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/fbe46475-86bf-4bb1-af4a-51cb61878775)


<hr>

## 📱 Screenshots For Student UI
### Home Page (Enter the class code and enroll)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/344c550c-c258-4a0a-9d99-0ac67069bf34)

### Class Page With the Tabs
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/1802a3fe-27c3-474b-9dc9-b971ba3eb17c)

### Un Enroll Dialog 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/741f793a-ab70-4d4b-8822-42ea6325bc4c)

### Quizs Tab
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/8e81f585-78ad-461e-b413-84445fd2891a)

### If you started the quiz
#### If you entered before you will see the final result, correct answers and also you answers
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/fd897fc9-40a2-4d5c-92a5-f0f9364c2d4f)

![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/d3166b9a-c69e-4b14-a3a0-6a443145fd78)

#### If it the first time to enter the quiz (answer before the timer closes the quiz over you :)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/a63daa0c-52c0-4725-9617-5f60ac152583)



### Student Marks
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/85ccf3e6-1476-457e-a7bf-00b38f6d1e87)


### Annoucements
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/f9307cd8-da8b-43b3-ada4-2d47472b097b)


<hr>

## 📱 General Screenshots 
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/f94cf2a4-0461-4b16-80ed-48eeb19581a2)

 ###  Frofile page
 ![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/1b3eaa41-0899-417a-add1-39cf11c8b040)

### change Password Dialog Form
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/9977bd42-d53b-42ee-91ba-79843afb7a01)

### My Classes List
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/95a3385a-02fe-42d2-ace2-f66ea4af55dd)


### List Of My Marks
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/be3d2fe3-5d60-4445-b91d-45b1d67befa1)


### Real-Time Chats
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/fed3b962-8a96-4d10-bccb-36e96a1fb7b5)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/6eabec3d-b95e-4c90-a3e4-408f99d2a2cf)


### Auth. Forms

![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/d9d74ee5-1787-465d-a547-aa73ef595928)

![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/7a911c28-3976-401e-aa73-fcf636a3e0cd)

![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/e4bb6302-141b-41de-9b76-f461d76dab0e)

![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/d10cadcb-58e3-457c-ad3d-f12ebc8e8efb)
![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/a3a77bc7-f6d6-41cb-9bb7-dd4a6b2355ab)


## Run Locally
Clone the project

```bash
  https://github.com/MhmoudYahia/Class-Manager.git
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
