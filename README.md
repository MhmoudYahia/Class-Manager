![image](https://github.com/MhmoudYahia/Class-Manager/assets/94763036/e0fbac44-4c78-423d-8668-4bc2d328e35b)



# Class-Manager
This project is a Class Manager website built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It provides a platform for managing classes, students, and instructors. 

## 🧑🏼‍💻 Client  Tech Stack
- ReactJS
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

For detailed instructions on setup, usage, and additional features, please refer to the project's README file.

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
#### User-Friendly Alerts:
Throughout the website, user-friendly alerts are implemented to provide guidance, notifications, and feedback, enhancing the overall user experience.



  
## API Reference

#### Get all items

```http
  GET /api/v1/classes
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` |You can get all classes;, create new ones, and edit and delete classes. There are also special endpoints for some special requirements.|



#### See Full API Documentation on Postman [here](https://documenter.getpostman.com/view/23936176/2s9Xy6pUw4)

## 📱 Screenshots (More Details are in Live Demo)


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
