//GET /api/user

export const getUserData = async(req, res) => {
    try {
        if (!req.user) {
            return res.json({success: false, message: "User not found"})
        }
        
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({success: true, role, recentSearchedCities})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
};

//Store User Recent Searched Cities
export const storeRecentSearchedCities = async(req, res) => {
    try {
        if (!req.user) {
            return res.json({success: false, message: "User not authenticated"})
        }
        
        const {recentSearchCity} = req.body;
        const user = req.user;

        if(user.recentSearchedCities.length < 3) {
            user.recentSearchedCities.push(recentSearchCity);
        }
        else{
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchCity);
        }
        await user.save();
        res.json({success: true, message:"City added"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}