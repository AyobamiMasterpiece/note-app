import {
  Modal,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
  ToastAndroid,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useEffect, useState, useRef } from "react";
import {
  getCurrentDate,
  getCurrentTime12Hour,
  getTimeOfCreation,
  Note,
} from "./dateFunctions";
import IconButton from "./IconButton";
import DoneBtn from "./DoneBtn";
import DeleteModal from "./DeleteModal";
import DeleteScreen from "./DeleteScreen";

//////////////////////remember to use logic for modal time by passing a prop to know wheter modal was opened by a note click
function ModalNote({
  visible,
  handleNoteNodal,
  notes,
  handledeleteitem,
  handleSetnote,
  noteData,
  ChangeNoteData,
  isdone,
  changeisdone,
  noteMode,
  changeNoteMode,
  itemId,
  changeItemId,
}) {
  // const textInputRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [showDeleteScreen, setShowDeleteScreen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // console.log(fadeAnim, "k");
  const toggleVisibility = () => {
    const toValue = isVisible ? 0 : 1; // Toggle between 0 and 1

    Animated.timing(fadeAnim, {
      toValue,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true, // Set to false when using layout properties like opacity
    }).start(() => {
      // Animation completion callback
      setIsVisible(!isVisible);
    });
  };

  const [time, setTime] = useState(noteData.time);

  const [noteObj, setNoteObj] = useState({
    note: noteData.note,
    title: noteData.title,
  });
  const formerNote = useRef({
    note: noteData.note,
    title: noteData.title,
  });

  function handleSaved() {
    if (noteObj.note.trim() == "" && noteObj.title.trim() == "") {
      /////////todo : alert user to write smth

      ToastAndroid.showWithGravityAndOffset(
        "Please write a note before saving",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        250
      );
      return;
      ///// dont save if no notes or title
    }
    changeisdone(true);
    if (
      noteObj.note == formerNote.current.note &&
      noteObj.title == formerNote.current.title
    ) {
      return; //// if note is the same with old version
    }
    setTime(new Date().toJSON());

    if (noteMode == "edit") {
      handleSetnote((old) => {
        let newdata = old.map((item) => {
          console.log(item.id);
          if (item.id === itemId) {
            return new Note(
              noteObj.note.trim(),
              null,
              itemId,
              noteObj.title.trim()
            );
          }
          return item;
        });

        return newdata;
      });

      return;
    }

    let note = new Note(noteObj.note, null, null, noteObj.title);

    handleSetnote((old) => {
      return [note, ...old];
    });

    // handleNoteNodal();
    // console.log(notes);
    if (noteMode == "new") {
      changeNoteMode("edit");
      changeItemId(note.id);
    }
  }
  function handlenotechange(text) {
    setNoteObj({
      ...noteObj,
      note: text,
    });
    changeisdone(false);
  }
  function handletitlechange(text) {
    setNoteObj({
      ...noteObj,
      title: text,
    });
    changeisdone(false);
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      style={styles.modal}
      transparent={true}
    >
      {showDeleteScreen && (
        <DeleteScreen
          onpress={() => setShowDeleteScreen(false)}
          ondelete={() => {
            handledeleteitem(itemId);
            handleNoteNodal();
            changeNoteMode("new");
          }}
          handledeleteitem={handledeleteitem}
          itemId={itemId}
        />
      )}
      <View style={styles.noteContainer}>
        <View style={styles.innerView}>
          <View style={styles.menu}>
            <IconButton
              onPress={() => {
                handleNoteNodal();
                changeNoteMode("new");
                handleSaved();
              }}
              underlayColor={"grey"}
              iconName={"arrow-back"}
              iconType={"materialicon"}
              iconSize={25}
              iconColor={"white"}
            />

            <Text
              style={{
                marginLeft: 20,
                fontSize: 18,
                color: "white",
              }}
            >
              Notes
            </Text>

            <DoneBtn
              handleSaved={handleSaved}
              isdone={isdone}
              noteObj={noteObj}
              notemode={noteMode}
            />

            {noteMode != "new" && isdone == true && (
              <IconButton
                onPress={() => {
                  toggleVisibility();
                }}
                underlayColor={"grey"}
                iconName={"dots-three-vertical"}
                iconType={"entypo"}
                iconSize={20}
                iconColor={"white"}
                style={{
                  alignSelf: "center",
                  right: 0,
                  position: "absolute",
                }}
              />
            )}
            {
              <DeleteModal
                onpress={() => {
                  toggleVisibility();
                  setShowDeleteScreen(!showDeleteScreen);
                  Keyboard.dismiss();
                }}
                fadeAnim={fadeAnim}
              />
            }
          </View>

          <ScrollView style={styles.scroll}>
            <View style={styles.timeBox}>
              {
                <Text style={styles.time}>
                  {noteMode == "new"
                    ? getCurrentTime12Hour(new Date(time))
                    : getTimeOfCreation(new Date(time))}
                </Text>
              }
            </View>

            <View style={styles.titleInput}>
              <TextInput
                placeholder={"Title"}
                style={styles.title}
                placeholderTextColor={"white"}
                cursorColor="white"
                onChangeText={handletitlechange}
                value={noteObj.title}
              ></TextInput>
            </View>

            <View style={styles.note}>
              <TextInput
                value={noteObj.note}
                multiline={true}
                autoFocus={true}
                style={styles.notePad}
                cursorColor="white"
                placeholder="Note something down"
                placeholderTextColor={"white"}
                onChangeText={handlenotechange}

                // ref={textInputRef}
              ></TextInput>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    // height: "20%",
    // width: "99%",
    // borderTopRightRadius: 35,
    // borderTopLeftRadius: 35,
    // alignSelf: "center",
    // position: "absolute",
    // bottom: 0,

    backgroundColor: "black",
  },
  modal: {
    flex: 1,
    position: "relative",
  },
  timeBox: {
    marginTop: 20,
    //  backgroundColor: "yellow",
  },
  innerView: {
    width: "95%",
    position: "relative",
    flex: 1,
    // backgroundColor: "red",
  },
  time: {
    color: "white",
  },
  titleInput: {
    // backgroundColor: "pink",

    marginTop: 20,
  },
  title: {
    fontSize: 20,
    color: "white",
  },
  note: {
    padding: 10,
    marginTop: 5,

    // backgroundColor: "cyan",
  },
  notePad: {
    fontSize: 15,
    color: "white",
  },
  menu: {
    // backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
    height: "5%",
    //  backgroundColor: "blue",
    margin: 0,
    // backgroundColor: "pink",
  },

  writecontainer: {
    backgroundColor: "pink",
  },
  scroll: {
    //  backgroundColor: "yellow",
    maxHeight: "80%",
  },
});

export default ModalNote;
