import click

from . import __version__, dragon_curve, matplotlib


@click.command()
@click.version_option(version=__version__)
def main():
    l = dragon_curve(10)

    matplotlib(l)
