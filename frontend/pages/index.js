import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useFormik } from 'formik';
import axios from 'axios';
import { useRouter } from 'next/router';
import {Button , Modal} from 'react-bootstrap';
import Link from 'next/link'
import {useState} from 'react'

const Home = ({posts}) => {
  
  // defining a useRouter Hook!
  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  }

  //async function to delete a post
  async function deletePost ({post}){
    try{
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${post.id}`);
    }
    catch(err){
      console.error(err)
    }

    refreshData();

  }

  // defining the formik hook
  const formik = useFormik({
    initialValues: {
      name: '',
      caption: '',
      url: ''
    },
    onSubmit: async (values) => {
      try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}` , {
          name: values.name,
          caption: values.caption,
          url: values.url
        })
      }
      catch(err){
        console.log(err)
      }
      refreshData();
    },
  });

  //returning the html content of the homepage
  return (
    <div className={styles.container}>
      <Head>
        <title>XMeme</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
          <h1>XMeme</h1>
          <p>A Social Media For Memes</p>
      </header>

      {/* parsing through the posts props passed to the Home function*/}
      <main className={styles.main}>
        <div className={styles.grid}>
            {posts.map((post) => 
            (
              
              <div key={post.id} className={styles.card}>
                <h3>{post.name}</h3>
                <p>{post.caption}</p><br></br>
                <img src={post.url} height="300" width="300" alt="Picture of Meme"/>
                <Button variant="dark mt-2" onClick={()=>deletePost({post})}>Delete</Button>&nbsp;&nbsp;
                <Link href={`/${post._id}/edit`}>
                    <Button variant="dark mt-2">Edit</Button>
                </Link>
              </div>
            )
            )}
        </div>
      </main>
        
      {/*  Create Form  */}
      <footer className={styles.footer}>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="name">Name</label>
          &nbsp;&nbsp;
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your Name:"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          &nbsp;&nbsp;
          <label htmlFor="caption">Caption</label>
          &nbsp;&nbsp;
          <input
            id="caption"
            name="caption"
            type="text"
            placeholder="Enter the Caption:"
            onChange={formik.handleChange}
            value={formik.values.caption}
          />
          &nbsp;&nbsp;
          <label htmlFor="url">URL</label>
          &nbsp;&nbsp;
          <input
            id="url"
            name="url"
            type="text"
            placeholder="Enter the URL:"
            onChange={formik.handleChange}
            value={formik.values.url}
          />
          &nbsp;&nbsp;
          <button type="submit">Submit</button>
        </form>
      </footer>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`)
  const posts = await res.json()

  // Pass data to the page via props
  return { props: { posts } }
}


export default Home;