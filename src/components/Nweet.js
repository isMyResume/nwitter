import {dbService, storageService} from "../fbase";
import {deleteDoc, doc, updateDoc} from "firebase/firestore";
import {useState} from "react";
import {deleteObject, ref} from "firebase/storage";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPencilAlt} from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {

    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);


    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if (ok) {
            const nweetText = doc(dbService, `nweets/${nweetObj.id}`);
            const nweetImage = ref(storageService, nweetObj.attachmentUrl);
            await deleteDoc(nweetText);
            if (nweetObj.attachmentUrl !== "") {
                await deleteObject(nweetImage);
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);
    const onChange = (event) => {

        const {
            target: {value},
        } = event;
        setNewNweet(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, `nweets/${nweetObj.id}`), {text: newNweet});
        setEditing(false);
    };
    return (
        <div className="nweet">

            {editing ? (
                    <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            <input onChange={onChange}
                                   value={newNweet}
                                   required
                                   placeholder="Edit your nweet"
                                   autoFocus
                                   className="formInput"
                            />
                            <input type="submit" value="Update Nweet" className="formBtn"/>
                        </form>
                        <button onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </button>
                    </>
                ) :
                (<>
                    <h4>{nweetObj.text}</h4>
                    {
                        nweetObj.attachmentUrl && (
                            <img src={nweetObj.attachmentUrl} width={"50px"} height={"50px"}/>
                        )
                    }
                    {isOwner && (
                        <div className="nweet__actions">
                          <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash}/>
                          </span>
                            <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt}/>
                          </span>
                        </div>
                    )

                    }

                </>)}
        </div>
    );
};

export default Nweet;