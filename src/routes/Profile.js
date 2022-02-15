import {authService, dbService} from "../fbase";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {updateProfile} from "firebase/auth";
import Nweet from "../components/Nweet";

const Profile = ({userObj, refreshUser}) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [nweets, setNweets] = useState([]);
    const navigate = useNavigate();

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {
                displayName: newDisplayName,
            });
            refreshUser();
        }
    };
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const getMyNweets = async () => {
        const q = query(collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid)
            , orderBy("createdAt", "asc"));


        const myNweets = onSnapshot(q, (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        }, []);

    };

    useEffect(() => {
        getMyNweets();
    }, []);

    return (
        <>
            <div>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
            <form onSubmit={onSubmit}>
                <input
                    onChange={onChange}
                    type="text"
                    placeholder={"Display name"}
                    value={newDisplayName}
                />
                <input
                    type="submit"
                    value={"Update Profile"}/>
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;