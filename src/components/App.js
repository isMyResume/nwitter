import AppRouter from "components/Router";
import {useEffect, useState} from "react";
import {authService} from "fbase";
import {updateProfile} from "firebase/auth";


function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setUserObj(
                    // user
                    {
                        uid: user.uid,
                        displayName: user.displayName,
                        phtotoURL: user.photoURL,
                        updateProfile: (args) => updateProfile(user, {displayName: args}),
                    }
                );
                console.log(user);
            } else {
                setIsLoggedIn(false);
            }
            setInit(true);
        });
    }, []);

    const refreshUser = () => {
        const user = authService.currentUser;

        setUserObj({
            uid : user.uid,
            displayName : user.displayName,
            updateProfile: (args) => updateProfile(user, {displayName: args}),
        });
    };
    return (
        <>
            {init ? (
                    <AppRouter
                        refreshUser={refreshUser}
                        isLoggedIn={Boolean(userObj)}

                        userObj={userObj}
                    />) :
                ("initializing...")
            }
        </>
    );
}

export default App;
