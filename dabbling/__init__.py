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
        l = new_portion + l
        l = [
                [n[0] - new_pivot[0],
                    n[1] - new_pivot[1]]
                for n in l]

        return l


def matplotlib(dragon_curve_path: PathType):
    import matplotlib.pyplot as plt

    plt.scatter(
            [n[0] for n in dragon_curve_path],
            [n[1] for n in dragon_curve_path])
    plt.show()
    plt.savefig('dragon-curve.png')


def path_to_svg_file_content(path: PathType) -> str:
    svg_path = ''.join(f'M{p[0]} {p[1]} ' for p in path).strip()
    return '''
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">

  <path d="{svg_path}"/>

</svg>
    '''.strip()
