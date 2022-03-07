import math
import random
from subprocess import Popen

import cv2
import numpy as np


BLOOD_COLOR = (0, 0, 255, 255)
STICK_FIGURE_COLOR = (0, 0, 0, 255)


def make_random_direction_exp():
    return math.e ** (1j * math.tau * random.random())


def make_random_direction_sin_cos():
    uniform = random.random()
    return complex(
        cos(math.tau * uniform),
        math.sin(math.tau * uniform),
    )


def make_random_stick_figure_positions():
    head_neck_distance = 0.05
    elbow_neck_distance = arm_tip_elbow_distance = 0.1
    pelvis_neck_distance = 0.15
    knee_pelvis_distance = 0.1
    leg_tip_knee_distance = 0.1

    head_position = random.random() + random.random() * 1j

    neck_position = head_position + head_neck_distance * math.e ** (
        math.tau * 1j * random.random()
    )

    left_elbow_position = neck_position + elbow_neck_distance * math.e ** (
        math.tau * 1j * random.random()
    )
    right_elbow_position = neck_position + elbow_neck_distance * math.e ** (
        math.tau * 1j * random.random()
    )

    left_arm_tip_position = left_elbow_position + arm_tip_elbow_distance * math.e ** (
        math.tau * 1j * random.random()
    )
    right_arm_tip_position = right_elbow_position + arm_tip_elbow_distance * math.e ** (
        math.tau * 1j * random.random()
    )

    pelvis_position = neck_position + pelvis_neck_distance * math.e ** (
        math.tau * 1j * random.random()
    )

    left_knee_position = pelvis_position + knee_pelvis_distance * math.e ** (
        math.tau * 1j * random.random()
    )
    right_knee_position = pelvis_position + knee_pelvis_distance * math.e ** (
        math.tau * 1j * random.random()
    )

    left_leg_top_position = left_knee_position + leg_tip_knee_distance * math.e ** (
        math.tau * 1j * random.random()
    )
    right_leg_top_position = right_knee_position + leg_tip_knee_distance * math.e ** (
        math.tau * 1j * random.random()
    )

    return [
        (x.real, x.imag)
        for x in (
            head_position,
            neck_position,
            left_elbow_position,
            right_elbow_position,
            left_arm_tip_position,
            right_arm_tip_position,
            pelvis_position,
            left_knee_position,
            right_knee_position,
            left_leg_top_position,
            right_leg_top_position,
        )
    ]


def make_blood_splatter_positions(stick_figure_positions):
    return [
            (x.real, x.imag)
            for x in [
        complex(*stick_figure_positions[1])
        + 0.05 * i * math.e ** (math.tau * 1j * random.random())
        for i in range(3)
    ] + [
        complex(*stick_figure_positions[6])
        + 0.05 * i * math.e ** (math.tau * 1j * random.random())
        for i in range(3)
    ]]


def draw_blood_splatter(image, blood_splatter_positions):
    image_height, image_width = image.shape[:2]

    blood_splatter_positions = [
        (int(x * image_width), int(y * image_height))
        for x, y in blood_splatter_positions
    ]


    cv2.circle(image, blood_splatter_positions[0], 20, BLOOD_COLOR, -1)
    cv2.circle(image, blood_splatter_positions[1], 10, BLOOD_COLOR, -1)
    cv2.circle(image, blood_splatter_positions[2], 5, BLOOD_COLOR, -1)

    cv2.circle(image, blood_splatter_positions[3], 20, BLOOD_COLOR, -1)
    cv2.circle(image, blood_splatter_positions[4], 10, BLOOD_COLOR, -1)
    cv2.circle(image, blood_splatter_positions[5], 5, BLOOD_COLOR, -1)


def draw_stick_figure(image, stick_figure_positions):
    # https://docs.opencv.org/4.x/d6/d6e/group__imgproc__draw.html#ga7078a9fae8c7e7d13d24dac2520ae4a2
    # https://docs.opencv.org/4.x/dc/da5/tutorial_py_drawing_functions.html

    image_height, image_width = image.shape[:2]

    stick_figure_positions = [
        (int(x * image_width), int(y * image_height)) for x, y in stick_figure_positions
    ]

    # create blank image

    cv2.circle(image, stick_figure_positions[0], 15, STICK_FIGURE_COLOR, -1)

    for index_a, index_b in [
        (0, 1),
        (1, 2),
        (1, 3),
        (2, 4),
        (3, 5),
        (1, 6),
        (7, 6),
        (8, 6),
        (7, 9),
        (8, 10),
    ]:
        cv2.line(
            image,
            stick_figure_positions[index_a],
            stick_figure_positions[index_b],
            STICK_FIGURE_COLOR,
            5,
        )


def main():
    random.seed(0)

    image_width, image_height = 500, 500

    image = 255 * np.ones(shape=[image_width, image_height, 4], dtype=np.uint8)

    for i in range(100):
        stick_figure_positions = make_random_stick_figure_positions()

        blood_splatter_positions = make_blood_splatter_positions(stick_figure_positions)

        draw_blood_splatter(image, blood_splatter_positions)

        draw_stick_figure(image, stick_figure_positions)

        cv2.imwrite(f"prakdan_{i:02d}.png", image)

    convert_process = Popen(['convert', 'prakdan_*.png', 'prakdan.gif'])

    convert_process.wait()

if __name__ == "__main__":
    main()
