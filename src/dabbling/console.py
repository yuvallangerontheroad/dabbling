import click

from . import __version__
from .dragon_curve import dragon_curve, path_to_curvy_svg_no_clue, path_to_svg_file_content, write_matplotlib_png
from .hilbert_curve import hilbert_curve, make_svg_content


@click.command()
@click.option(
        '--iterations',
        '-n',
        default='5',
        help='Number of iterations',
        metavar='ITERS',
        show_default=True,
)
@click.version_option(version=__version__)
def main_dragon(iterations: str):
    l = dragon_curve(int(iterations))

    svg_content = path_to_svg_file_content(l)
    with open('dragon-curve.svg', 'w') as f:
        f.write(svg_content)

    svg_content = path_to_curvy_svg_no_clue(l)
    with open('dragon-curvy-no-clue.svg', 'w') as f:
        f.write(svg_content)

    write_matplotlib_png(l)

    click.echo(l)


@click.command()
@click.option(
        '--iterations',
        '-n',
        default='5',
        help='Number of iterations',
        metavar='ITERS',
        show_default=True,
)
@click.version_option(version=__version__)
def main_hilbert(iterations: str):
    l = hilbert_curve(int(iterations))

    svg_content = make_svg_content(l)
    with open('hilbert-curve.svg', 'w') as f:
        f.write(svg_content)
