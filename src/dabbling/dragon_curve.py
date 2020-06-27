__version__ = '0.1.0'


from typing import List, Tuple


PathType = List[Tuple[int, int]]


def ccw(p: Tuple[int, int]) -> Tuple[int, int]:
    return [-p[1], p[0]]


def dragon_curve(generation_number: int) -> PathType:
    l = [[0, 0], [1, 0]] 

    for i in range(generation_number):
        new_portion = [ccw(n) for n in l[1:]]
        new_pivot = new_portion[-1]
        l = new_portion[::-1] + l
        l = [
                [n[0] - new_pivot[0],
                    n[1] - new_pivot[1]]
                for n in l]

    return l


def write_matplotlib_png(dragon_curve_path: PathType):
    import matplotlib.pyplot as plt

    plt.scatter(
            [n[0] for n in dragon_curve_path],
            [n[1] for n in dragon_curve_path])
    plt.show()
    plt.savefig('dragon-curve.png')


def transform(values, low, high):
    min_value = min(values)
    max_value = max(values)
    old_difference = max_value - min_value
    new_difference = high - low
    # values = [n - min_value for n in values] # [0, max-min = old_difference]
    # values = [n / old_difference for n in values] # [0, 1]
    # values = [n * new_difference for n in values] # [0, new_difference = high - low]
    # values = [n + low for n in values] # [low, high]
    return [(n - min_value) * new_difference / old_difference + low
            for n in values]


def path_to_svg_file_content(
        path: PathType,
        image_width=500,
        image_height=500,
        left_border=50,
        right_border=50,
        bottom_border=50,
        top_border=50,
    ) -> str:
    path = list(zip(
        transform([p[0] for p in path], left_border, image_width - right_border),
        transform([p[1] for p in path], top_border, image_width - bottom_border)))

    svg_path = ''.join(f'L{p[0]} {p[1]}' for p in path)

    return f'''
<svg width="{image_width}" height="{image_height}" fill="white" xmlns="http://www.w3.org/2000/svg">

  <path fill="none" stroke="black" stroke-linejoin="round" stroke-width="0.7" d="M{path[0][0]} {path[0][1]}{svg_path}"/>

</svg>
    '''.strip()


def path_to_curvy_svg_no_clue(
        path: PathType,
        image_width=500,
        image_height=500,
        left_border=50,
        right_border=50,
        bottom_border=50,
        top_border=50,
    ) -> str:
    '''
    path = list(zip(
        transform([p[0] for p in path], left_border, image_width - right_border),
        transform([p[1] for p in path], top_border, image_width - bottom_border)))
    '''

    min_x = min(p[0] for p in path)
    min_y = min(p[1] for p in path)
    max_x = max(p[0] for p in path)
    max_y = max(p[1] for p in path)

    stroke_width = (max_x - min_x) * 0.01

    consecutives = list(zip(path[:-1], path[1:]))

    svg_path = ''.join(f'L{p[0]} {p[1]}' for p in path)

    svg_path += (
        ''.join(
            f'M{pair[0][0]} {pair[0][1]}'
            f'A2 2 0 0 0 {pair[1][0]} {pair[1][1]}'
            for pair in consecutives))

    return f'''
<svg width="{image_width}" height="{image_height}" viewBox="{min_x-1} {min_y-1} {max_x-min_x+1} {max_y-min_y+1}" fill="white" xmlns="http://www.w3.org/2000/svg">

  <path fill="none" stroke="black" stroke-linejoin="round" stroke-width="{stroke_width}" d="M{path[0][0]} {path[0][1]}{svg_path}"/>

</svg>
    '''.strip()
