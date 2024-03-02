"use client";

import { useEffect, useRef, useState } from "react";
import { useMenu } from "@/store/store";
import styles from "./Menu.module.css";

export function Menu() {
    const [positions, setPositions] = useState({ top: 0, left: 0 });
    const [recalculate, setRecalculate] = useState(false);

    const setMenu = useMenu((state) => state.setMenu);
    const menu = useMenu((state) => state.menu);
    const container = useRef(null);
    const firstItem = useRef(null);
    const lastItem = useRef(null);

    useEffect(() => {
        function handeResize() {
            setRecalculate((prev) => !prev);
        }

        function handleScroll() {
            setRecalculate((prev) => !prev);
        }

        window.addEventListener("resize", handeResize);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("resize", handeResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        setPositions({ top: 0, left: 0 });
        if (!menu || !firstItem.current || !container?.current) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                menu.element.focus();
                setMenu(null);
            }

            if (e.key === "Tab") {
                e.preventDefault();
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (!container.current.contains(document.activeElement)) {
                    firstItem.current.focus();
                } else {
                    const currentFocused = document.activeElement;

                    if (currentFocused === lastItem.current) {
                        firstItem.current.focus();
                        return;
                    }

                    let nextItem = currentFocused.nextSibling;

                    if (nextItem?.nodeName === "HR") {
                        nextItem = nextItem.nextSibling;
                    }

                    if (nextItem) nextItem.focus();
                }
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (!container.current.contains(document.activeElement)) {
                    lastItem.current.focus();
                } else {
                    const currentFocused = document.activeElement;

                    if (currentFocused === firstItem.current) {
                        lastItem.current.focus();
                        return;
                    }

                    let prevItem = currentFocused.previousSibling;

                    if (prevItem?.nodeName === "HR") {
                        prevItem = prevItem.previousSibling;
                    }

                    if (prevItem) prevItem.focus();
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [menu, firstItem, lastItem, container]);

    function getScrollbarWidth() {
        // https://stackoverflow.com/questions/39392423/
        // calculating-width-of-scrollbar-and-using-result-in-calc-css

        const outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";

        document.body.appendChild(outer);

        const widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";

        const inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        const widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }

    useEffect(() => {
        if (!menu?.element || !container?.current) return;

        const menuRect = menu.element.getBoundingClientRect();
        const containerRect = container.current.getBoundingClientRect();
        const scrollbarWidth = getScrollbarWidth();
        const isBodyOverflowing = document.body.clientWidth < window.innerWidth;

        let menuPosition = {
            top: menuRect.top,
            left: menuRect.left,
        };

        if (menu.top) {
            menuPosition.top = menuRect.top - containerRect.height - 12;
        }

        if (menu.bottom) {
            menuPosition.top = menuRect.top + menuRect.height + 12;
        }

        if (menu.left) {
            menuPosition.left =
                menuRect.left - containerRect.width + menuRect.width;

            if (isBodyOverflowing) {
                menuPosition.left -= scrollbarWidth;
            }
        }

        if (menu.right) {
            menuPosition.left = menuRect.left;

            if (isBodyOverflowing) {
                menuPosition.left -= scrollbarWidth;
            }
        }

        setPositions(menuPosition);

        function handleClick(e) {
            if (
                !container.current.contains(e.target) &&
                !menu.element.contains(e.target)
            ) {
                setMenu(null);
            }
        }

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [menu, container, recalculate]);

    if (!menu) return null;

    return (
        <div
            ref={container}
            className={styles.wrapper}
            style={{
                transform: `translate(${positions.left}px, ${positions.top}px)`,
                visibility: positions.top === 0 ? "hidden" : "visible",
            }}
        >
            <div
                className={`
                    ${styles.container} 
                    ${menu.fit && styles.fit} 
                    ${menu.top && styles.top} 
                    ${menu.bottom && styles.bottom} 
                    ${menu.left && styles.left} 
                    ${menu.right && styles.right}
                `}
                onMouseLeave={() => {
                    document.activeElement.blur();
                }}
            >
                <ul>
                    {menu.topContent && (
                        <>
                            <div>{menu.topContent}</div>
                            <hr />
                        </>
                    )}

                    {menu.items.map((item, index) => {
                        let ref = undefined;
                        if (index === 0) ref = firstItem;
                        if (index === menu.items.length - 1) ref = lastItem;

                        if (item.name === "hr") {
                            return <hr key={index} />;
                        } else if (item?.show !== false) {
                            return (
                                <li
                                    ref={ref}
                                    key={index}
                                    tabIndex={0}
                                    className={`${
                                        item.danger && styles.danger
                                    } ${item.icon && styles.icon}`}
                                    onClick={() => {
                                        item.onClick();
                                        if (menu.keepOpen) return;
                                        setMenu(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            item.onClick();
                                            if (menu.keepOpen) return;
                                            setMenu(null);
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.focus();
                                    }}
                                >
                                    {item.icon && (
                                        <div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                fill="none"
                                            >
                                                {item.icon}
                                            </svg>
                                        </div>
                                    )}

                                    {item.name}

                                    {menu.active === index && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            viewBox="0 0 24 24"
                                        >
                                            {menu.activeIcon}
                                        </svg>
                                    )}
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}
