import React, { useState } from "react";
import { Card, Skeleton } from "antd";
import {
  SyncOutlined,
  PushpinOutlined,
  PushpinFilled,
} from "@ant-design/icons";
import TextTransition, { presets } from "react-text-transition";

import MealModal from "./MealModal";

// meal consists of:
//     name: '', calories: 0, carbs: 0,
//     protein: 0, fat: 0, ingredients: [],
//     instructions: [], servings: 0, makes: 0,
//     prepTime: 0, cookTime: 0

// mealObj consists of:
//      main: emptyMeal,
//      side: emptyMeal,
//      mainLoading: false,
//      sideLoading: false,
//      mainPinned: false,
//      sidePinned: false,

const MealCard = (props) => {
  const [showMainModal, setShowMainModal] = useState(false);
  const [showSideModal, setShowSideModal] = useState(false);

  function closeMainModal() {
    setShowMainModal(false);
  }

  function closeSideModal() {
    setShowSideModal(false);
  }

  function regenMain(e) {
    // prevents the meal modal from opening when clicking an icon
    e.stopPropagation();
    props.regenMain(props.mealNum);
  }

  function regenSide(e) {
    e.stopPropagation();
    props.regenSide(props.mealNum);
  }

  function pinMain(e) {
    e.stopPropagation();
    props.pinMain(props.mealNum);
  }

  function pinSide(e) {
    e.stopPropagation();
    props.pinSide(props.mealNum);
  }

  return (
    <>
      {props.numMeals >= props.mealNum && (
        <>
          <MealModal
            visible={showMainModal}
            meal={props.mealObj.main}
            closeModal={closeMainModal}
            regen={regenMain}
            pin={pinMain}
            pinned={props.mealObj.mainPinned}
            useIcons={true}
            loading={props.mealObj.mainLoading}
            isAuthenticated={props.isAuthenticated}
            username={props.username}
          />
          <MealModal
            visible={showSideModal}
            meal={props.mealObj.side}
            closeModal={closeSideModal}
            regen={regenSide}
            pin={pinSide}
            pinned={props.mealObj.sidePinned}
            useIcons={true}
            loading={props.mealObj.sideLoading}
            isAuthenticated={props.isAuthenticated}
            username={props.username}
          />
          <Card
            className={[
              "mealCard",
              "cardShadow2",
              !props.displayMeals &&
              !props.mealObj.mainPinned &&
              !props.mealObj.sidePinned
                ? "mealCardSkeletonPadding"
                : "",
            ].join(" ")}
            title={
              props.mealNum === 1
                ? props.numMeals === 1
                  ? "Feast"
                  : props.numMeals === 2
                  ? "Brunch"
                  : "Breakfast"
                : props.mealNum === 2
                ? props.numMeals === 2
                  ? "Dinner"
                  : "Lunch"
                : props.mealNum === 3
                ? "Dinner"
                : "Snack"
            }
            extra={
              props.mealObj.main.calories +
              props.mealObj.side.calories +
              " calories"
            }
            bordered={false}
          >
            <Skeleton
              avatar={false}
              title={false}
              loading={
                !props.displayMeals &&
                !props.mealObj.mainPinned &&
                !props.mealObj.sidePinned
              }
              active={props.mealObj.mainLoading || props.mealObj.sideLoading}
              paragraph={{ rows: 3, width: ["80%", "100%", "60%"] }}
            >
              <div className="mealCardBody">
                {/* used for when the number of meals in increased and the new card is 'blank' */}
                {props.mealObj.main.name && (
                  <div
                    className="mealCardRow"
                    onClick={() =>
                      props.mealObj.main.name !== "Network Error :(" &&
                      props.mealObj.main.name !== "No meals found :("
                        ? setShowMainModal(true)
                        : {}
                    }
                  >
                    {props.mealObj.main.name !== "Network Error :(" &&
                      props.mealObj.main.name !== "No meals found :(" && (
                        <div className="mealCardIcons">
                          {/* show regen icon if the meal isn't pinned */}
                          {!props.mealObj.mainPinned ? (
                            props.mealObj.mainLoading ? (
                              <SyncOutlined
                                spin
                                className="regenIcon"
                                onClick={(e) => regenMain(e)}
                              />
                            ) : (
                              <SyncOutlined
                                className="regenIcon"
                                onClick={(e) => regenMain(e)}
                              />
                            )
                          ) : (
                            <SyncOutlined
                              className="regenIcon"
                              style={{ opacity: 0 }}
                            />
                          )}
                          &nbsp;&nbsp;&nbsp;
                          {props.mealObj.mainPinned ? (
                            <PushpinFilled
                              className="pinIcon"
                              onClick={(e) => pinMain(e)}
                            />
                          ) : (
                            <PushpinOutlined
                              className="pinIcon"
                              onClick={(e) => pinMain(e)}
                            />
                          )}
                        </div>
                      )}
                    <TextTransition
                      className="mealCardTitleText"
                      text={props.mealObj.main.name}
                    />

                    <div className="space2" />
                    {props.mealObj.main.name !== "Network Error :(" &&
                      (props.mealObj.main.name !== "No meals found :(" ? (
                        <TextTransition
                          className="mealCardServingText"
                          text={
                            props.mealObj.main.servings +
                            (props.mealObj.main.servings === 1
                              ? " serving"
                              : " servings")
                          }
                        />
                      ) : (
                        <div className="mealCardServingText">
                          Try again with different preferences
                        </div>
                      ))}
                  </div>
                )}
                {props.mealObj.side.name && (
                  <>
                    <div className="space4" />
                    <div
                      className="mealCardRow"
                      onClick={() =>
                        props.mealObj.side.name !== "Network Error :(" &&
                        props.mealObj.side.name !== "No meals found :("
                          ? setShowSideModal(true)
                          : {}
                      }
                    >
                      {props.mealObj.side.name !== "Network Error :(" &&
                        props.mealObj.side.name !== "No meals found :(" && (
                          <div className="mealCardIcons">
                            {/* show regen icon if the meal isn't pinned */}
                            {!props.mealObj.sidePinned ? (
                              props.mealObj.sideLoading ? (
                                <SyncOutlined
                                  spin
                                  className="regenIcon"
                                  onClick={(e) => regenSide(e)}
                                />
                              ) : (
                                <SyncOutlined
                                  className="regenIcon"
                                  onClick={(e) => regenSide(e)}
                                />
                              )
                            ) : (
                              <SyncOutlined
                                className="regenIcon"
                                style={{ opacity: 0 }}
                              />
                            )}
                            &nbsp;&nbsp;&nbsp;
                            {props.mealObj.sidePinned ? (
                              <PushpinFilled
                                className="pinIcon"
                                onClick={(e) => pinSide(e)}
                              />
                            ) : (
                              <PushpinOutlined
                                className="pinIcon"
                                onClick={(e) => pinSide(e)}
                              />
                            )}
                          </div>
                        )}
                      <TextTransition
                        className="mealCardTitleText"
                        text={props.mealObj.side.name}
                      />
                      <div className="space2" />
                      {props.mealObj.side.name !== "Network Error :(" &&
                        (props.mealObj.side.name !== "No meals found :(" ? (
                          <TextTransition
                            className="mealCardServingText"
                            text={
                              props.mealObj.side.servings +
                              (props.mealObj.side.servings === 1
                                ? " serving"
                                : " servings")
                            }
                          />
                        ) : (
                          <div className="mealCardServingText">
                            Try again with different preferences
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </Skeleton>
          </Card>
        </>
      )}
    </>
  );
};

export default MealCard;
