import {useEffect, useState} from "react";
import {collection, onSnapshot} from "firebase/firestore";
import {dbService} from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "../components/NweetFactory";

const Home = ({userObj}) => {
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(dbService, "nweets"), (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        }, []);


    }, []);

    return (
        <>
            <NweetFactory userObj={userObj}/>
            <div style={{marginTop:30}}>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </>
    );
};

export default Home;