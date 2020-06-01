import click

from . import __version__, dragon_curve, matplotlib, path_to_svg_file_content


@click.command()
@click.version_option(version=__version__)
def main():
    l = dragon_curve(12)

    svg_content = path_to_svg_file_content(l)
    with open('dragon_curve.svg', 'w') as f:
        f.write(svg_content)
    matplotlib(l)
    click.echo(l)
