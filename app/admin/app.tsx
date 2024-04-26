"use client"

import { Admin, ListGuesser, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const dataProvider = simpleRestProvider("/api"); // Indica el endpoint para obtener la data

const App = () => {
  return(
    <Admin dataProvider={dataProvider}>
      <Resource 
        name="courses"
        list={ListGuesser}
        recordRepresentation="title"
      />
    </Admin>
  )
}

export default App