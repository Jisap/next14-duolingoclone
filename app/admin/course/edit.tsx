import { SimpleForm, Edit, TextInput, required } from "react-admin";

const CourseEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput 
          source="id" // este id indica la ruta /api/courses/[courseId]
          validate={[required()]} 
          label="ID" 
        />
        <TextInput 
          source="title" 
          validate={[required()]} 
          label="Title" 
        />
        <TextInput 
          source="imageSrc" 
          validate={[required()]} 
          label="Image" 
        />
      </SimpleForm>
    </Edit>
  );
};
export default CourseEdit;