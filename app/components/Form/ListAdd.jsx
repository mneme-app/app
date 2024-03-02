"use client";

import { ListItem, Select, Input } from "@client";
import { useState, useEffect, useRef } from "react";

export function ListAdd({
    item,
    listChoices,
    listChosen,
    listProperty,
    listSetter,
    createNew,
    type,
    disabled,
    messageIfNone,
}) {
    const [filter, setFilter] = useState("");
    const [filteredChoices, setFilteredChoices] = useState(listChoices);
    const [showSelect, setShowSelect] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        if (!listChoices || !listChoices.length) return;

        setFilteredChoices(
            listChoices.filter((choice) => {
                if (!choice) return false;
                let prop;
                if (Array.isArray(listProperty)) {
                    prop = listProperty.find((p) => choice[p]);
                    if (!prop) prop = "_id";
                } else {
                    prop = listProperty;
                }
                const pattern = new RegExp(filter, "i");
                return pattern.test(choice[prop]);
            }),
        );
    }, [filter, listChoices]);

    useEffect(() => {
        if (!selectRef.current) return;
        const handleClickOutside = (e) => {
            if (!selectRef.current.contains(e.target)) {
                setShowSelect(false);
            }
        };

        const handleBlur = (e) => {
            setTimeout(() => {
                if (!selectRef.current.contains(document.activeElement)) {
                    setShowSelect(false);
                }
            }, 0);
        };

        document.addEventListener("mousedown", handleClickOutside);
        selectRef.current.addEventListener("focusout", handleBlur);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (selectRef && selectRef.current)
                selectRef.current.removeEventListener("focusout", handleBlur);
        };
    }, [showSelect]);

    if (type === "datalist")
        return (
            <div style={{ position: "relative" }} ref={selectRef}>
                <ol
                    className={`chipList ${disabled ? "disabled" : ""}`}
                    style={{
                        opacity: disabled ? "0.3" : "",
                        cursor: disabled ? "not-allowed" : "",
                    }}
                >
                    {messageIfNone && listChosen.length === 0 && (
                        <ListItem item={messageIfNone} />
                    )}

                    {listChosen.length > 0 &&
                        listChosen.map((choice, index) => {
                            if (!choice)
                                return (
                                    <ListItem
                                        key={`${choice}_${index}`}
                                        item="Unavailable"
                                    />
                                );

                            let prop;
                            if (Array.isArray(listProperty)) {
                                prop = listProperty.find((p) => choice[p]);
                                if (!prop) prop = "_id";
                            } else {
                                prop = listProperty;
                            }

                            return (
                                <ListItem
                                    key={choice._id ?? choice.id}
                                    link={choice.url ? choice.url : undefined}
                                    item={choice[prop]}
                                    action={() => {
                                        listSetter(
                                            listChosen.filter(
                                                (x) => x._id !== choice._id,
                                            ),
                                        );
                                    }}
                                    actionType={"delete"}
                                />
                            );
                        })}
                </ol>

                <Input
                    label={item}
                    value={filter}
                    autoComplete="off"
                    onChange={(val) => {
                        setFilter(val);
                        if (val.length) {
                            setShowSelect(true);
                        } else {
                            setShowSelect(false);
                        }
                    }}
                    action="Add Tag"
                    onFocus={() => setShowSelect(true)}
                    onActionTrigger={(e) => {
                        e.preventDefault();
                        if (
                            filteredChoices &&
                            filteredChoices.length === 1 &&
                            !listChosen.includes(filteredChoices[0])
                        ) {
                            listSetter([...listChosen, filteredChoices[0]]);
                        }
                    }}
                />

                {showSelect && (
                    <Select
                        listChoices={filteredChoices}
                        listChosen={listChosen}
                        listProperty={listProperty}
                        listSetter={listSetter}
                        createNew={createNew}
                        disabled={disabled}
                        onBlur={() => setShowSelect(false)}
                    />
                )}
            </div>
        );

    return (
        <ol
            className={`chipList ${disabled ? "disabled" : ""}`}
            style={{
                opacity: disabled ? "0.3" : "",
                cursor: disabled ? "not-allowed" : "",
            }}
        >
            <ListItem
                item={item}
                actionType={"add"}
                select={
                    <Select
                        listChoices={listChoices}
                        listChosen={listChosen}
                        listProperty={listProperty}
                        listSetter={listSetter}
                        createNew={createNew}
                        disabled={disabled}
                    />
                }
                disabled={disabled}
            />

            {listChosen.length > 0 &&
                listChosen.map((choice, index) => {
                    if (!choice)
                        return (
                            <ListItem
                                key={`${choice}_${index}`}
                                item="Unavailable"
                            />
                        );

                    let prop;
                    if (Array.isArray(listProperty)) {
                        prop = listProperty.find((p) => choice[p]);
                        if (!prop) prop = "_id";
                    } else {
                        prop = listProperty;
                    }

                    return (
                        <ListItem
                            key={choice._id}
                            link={choice.url ? choice.url : undefined}
                            item={choice[prop]}
                            action={() => {
                                listSetter(
                                    listChosen.filter(
                                        (x) => x._id !== choice._id,
                                    ),
                                );
                            }}
                            actionType={"delete"}
                        />
                    );
                })}
        </ol>
    );
}
