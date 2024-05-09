const HomebrewModel = require('./homebrew.model.js').model;
const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const archive = {
    archiveApi: router,
    /* Searches for matching title, also attempts to partial match */
    findBrews: async (req, res, next) => {
        try {
            /*
            //log db name and collection name, for local purposes
            const dbName = HomebrewModel.db.name;
            console.log("Database Name:", dbName);
            const collectionName = HomebrewModel.collection.name;
            console.log("Collection Name:", collectionName);
            
            */

            const bright = '\x1b[1m'; // Bright (bold) style
		    const yellow = '\x1b[93m'; //  yellow color
            const reset = '\x1b[0m'; // Reset to default style
            console.log(`Query as received in ${bright + yellow}archive api${reset}:`);
            console.table(req.query);

            const title = req.query.title || '';
            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const minPageSize = 6;
            const pageSize = Math.max(
                parseInt(req.query.size) || 10,
                minPageSize
            );
            const skip = (page - 1) * pageSize;

            const brewsQuery = {
                $or: [],
                published: true,
            };

            if (req.query.legacy === 'true') {
                brewsQuery.$or.push({ renderer: 'legacy' });
            }

            if (req.query.v3 === 'true') {
                brewsQuery.$or.push({ renderer: 'V3' });
            }

            // If user wants to use RegEx it needs to format like /text/
            const titleConditionsArray =
                title.startsWith('/') && title.endsWith('/')
                    ? [
                          {
                              'title': {
                                  $regex: title.slice(1, -1),
                                  $options: 'i',
                              },
                          },
                      ]
                    : buildTitleConditions(title);

            function buildTitleConditions(inputString) {
                return [
                    {
                        $text: {
                            $search: inputString,
                            $caseSensitive: false,
                        },
                    },
                ];
            }

            const titleQuery = {
                $and: [brewsQuery, ...titleConditionsArray],
            };

            const projection = {
                editId: 0,
                googleId: 0,
                text: 0,
                textBin: 0,
            };
            const brews = await HomebrewModel.find(titleQuery, projection)
                .skip(skip)
                .limit(pageSize)
                .maxTimeMS(5000)
                .exec();

            const totalBrews = brews.length;

            const totalPages = Math.ceil(totalBrews / pageSize);
            console.log('Total brews: ', totalBrews);
            console.log('Total pages: ', totalPages);
            return res.json({ brews, page, totalPages, totalBrews });
        } catch (error) {
            console.error(error);
        
            if (error.response && error.response.status) {
                const status = error.response.status;
        
                if (status === 500) {
                    return res.status(500).json({
                        errorCode: '500',
                        message: 'Internal Server Error',
                    });
                } else if (status === 503) {
                    return res.status(503).json({
                        errorCode: '503',
                        message: 'Service Unavailable',
                    });
                } else {
                    return res.status(status).json({
                        errorCode: status.toString(),
                        message: 'Internal Server Error',
                    });
                }
            } else {
                return res.status(500).json({
                    errorCode: '500',
                    message: 'Internal Server Error',
                });
            }
        }
    },
};

router.get('/api/archive', asyncHandler(archive.findBrews));

module.exports = router;
