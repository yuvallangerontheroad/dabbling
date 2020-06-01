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


def path_to_svg_file_content(
        path: PathType,
        image_width = 1000,
        image_height = 1000,
    ) -> str:
    min_x = min(p[0] for p in path)
    min_y = min(p[1] for p in path)

    path = [(p[0] - min_x, p[1] - min_y) for p in path]

    max_x = max(p[0] for p in path)
    max_y = max(p[1] for p in path)

    path = [(image_width * p[0] / max_x, image_height * p[1] / max_y) for p in path]

    svg_path = f'M{path[0][0]} {path[0][1]}' + ''.join(f'L{p[0]} {p[1]} ' for p in path).strip()
    return f'''
<svg width="{image_width}" height="{image_height}" xmlns="http://www.w3.org/2000/svg">

  <path fill="none" stroke="black" stroke-linejoin="round" stroke-width="0.7" d="{svg_path}"/>

</svg>
    '''.strip()
