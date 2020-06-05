def mirror_on_y(path):
    max_x = max(p[0] for p in path)
    return [(abs(p[0] - max_x), p[1]) for p in path]


def mirror_on_x(path):
    max_y = max(p[1] for p in path)
    return [(p[0], abs(p[1] - max_y)) for p in path]


def mirror_on_xy(path):
    return [(p[1], p[0]) for p in path]


def right_flip(path):
    path = mirror_on_y(path)
    path = [(p[1], p[0]) for p in path]
    path = mirror_on_y(path)

    return path


def left_flip(path):
    return [(p[1], p[0]) for p in path]


def hilbert_curve(iterations=3):
    curve_coordinates = [
        (0, 0),
        (0, 1),
        (1, 1),
        (1, 0),
    ]

    for i in range(iterations):
        curve_coordinates = (
            left_flip(curve_coordinates) +
            [(p[0], p[1] + 2 ** (i + 1)) for p in curve_coordinates] +
            [(p[0] + 2 ** (i + 1), p[1] + 2 ** (i + 1)) for p in curve_coordinates] +
            [(p[0] + 2 ** (i + 1), p[1]) for p in right_flip(curve_coordinates)]
        )

    return curve_coordinates


def make_svg_content(
        path,
        image_width = 500,
        image_height = 500,
        ):
    min_x = min(p[0] for p in path)
    min_y = min(p[1] for p in path)
    max_x = max(p[0] for p in path)
    max_y = max(p[1] for p in path)
    path = mirror_on_x(path)
    stroke_width = min(0.1 * max_x, 0.1)
    svg_path = f'M{path[0][0]} {path[0][1]}' + ''.join(f'L{p[0]} {p[1]}' for p in path)
    return f'''
<svg width="{image_width}" height="{image_height}" viewBox="0 0 {max_x} {max_y}" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path stroke="black" stroke-width="{stroke_width}" d="{svg_path}"/>
</svg>'''


if __name__ == '__main__':
    import sys
    path = hilbert_curve(int(sys.argv[1]))
    svg_content = make_svg_content(path)
    with open('hilbert-curve.svg', 'w') as f:
        f.write(svg_content)
