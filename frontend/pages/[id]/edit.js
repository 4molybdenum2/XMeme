import styles from '../../styles/Home.module.css'
import { useFormik } from 'formik';
import axios from 'axios';
import { useRouter } from 'next/router';


const EditPost = () => {
    const router = useRouter();

  // update Form 
  const updateFormik = useFormik({
    initialValues: {
      caption: '',
      url: ''
    },

    onSubmit: async (values)=>{
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${router.query.id}`, {
                caption: values.caption,
                url: values.url
            })
            router.push("/");
        } catch (error) {
            console.log(error)
        }
    }
  });


  return (
    <div className={styles.container}>
        
        <main className={styles.main}>
            <header>
                <h1>Update Form</h1>
            </header>

            <div className={styles.card}>
                <form onSubmit={updateFormik.handleSubmit}>
                    <label htmlFor="caption">Caption:</label>
                    &nbsp;&nbsp;
                    <input
                        id="caption"
                        name="caption"
                        type="text"
                        placeholder="Enter the Caption:"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.caption}
                    />
                    <br></br><br></br>
                    <label htmlFor="url">URL:</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                        id="url"
                        name="url"
                        type="text"
                        placeholder="Enter the URL:"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.url}
                    />
                    <br></br><br></br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button type="submit">Submit</button>
                </form>
            </div>
        </main>
    </div>

  )
}

export default EditPost;