"use client"

import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import CourseList from "./course/list";
import CourseCreate from "./course/create";
import CourseEdit from "./course/edit";
import UnitList from "./unit/List";
import UnitCreate from "./unit/Create";
import UnitEdit from "./unit/Edit";

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
    </Admin>
  )
}

export default App