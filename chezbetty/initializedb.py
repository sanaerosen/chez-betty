import os
import sys
import transaction

from sqlalchemy import engine_from_config

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from models.account import Account
from models.item import Item
from models.user import User
from models.model import *

def usage(argv):    
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.create_all(engine)
    from models.account import Account
    from models.user import User
    from models.item import Item
    with transaction.manager:
        item = Item(
            "Nutrigrain Raspberry",
            "038000358210",
            14.37,
            1,
            True
        )
        DBSession.add(item)
        user = User(
            "zakir",
            "95951361",
            "Zakir Durumeric"
        )
        DBSession.add(user)

if __name__ == "__main__":
    main()
