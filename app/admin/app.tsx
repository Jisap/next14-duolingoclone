"use client"

import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import CourseList from "./course/list";
import CourseCreate from "./course/create";
import CourseEdit from "./course/edit";
import UnitList from "./unit/List";
import UnitCreate from "./unit/Create";
import UnitEdit from "./unit/Edit";
import LessonCreate from "./lesson/Create";
import LessonList from "./lesson/List";
import LessonEdit from "./lesson/Edit";
import ChallengeCreate from "./challenge/Create";
import ChallengeList from "./challenge/List";
import ChallengeEdit from "./challenge/Edit";
import ChallengeOptionCreate from "./challengeOption/Create";
import ChallengeOptionList from "./challengeOption/List";
import ChallengeOptionEdit from "./challengeOption/Edit";

const dataProvider = simpleRestProvider("/api"); // Indica el endpoint para obtener la data y sus métodos de actualización y borrado

const App = () => {
  return(
    <Admin dataProvider={dataProvider}>
      <Resource 
        name="courses"      //api/courses
        list={CourseList} 
        create={CourseCreate}
        edit={CourseEdit}
        recordRepresentation="title"
      />
      <Resource
        name="units"        //api/units
        recordRepresentation="title"
        create={UnitCreate}
        list={UnitList} 
        edit={UnitEdit}
      />
      <Resource
        name="lessons"      //api/lessons
        recordRepresentation="title"
        create={LessonCreate}
        list={LessonList}
        edit={LessonEdit}
      />
      <Resource
        name="challenges"     //api/challenges
        recordRepresentation="question"
        create={ChallengeCreate}
        list={ChallengeList}
        edit={ChallengeEdit}
      />
      <Resource
        name="challengeOptions"   //api/challengeOptions
        recordRepresentation="text"
        create={ChallengeOptionCreate}
        list={ChallengeOptionList}
        edit={ChallengeOptionEdit}
        options={{ label: "Challenge options" }}
      />

    </Admin>
  )
}

export default App