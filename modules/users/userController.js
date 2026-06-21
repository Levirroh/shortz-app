const User = require('./userModel');
const Video = require('../video/videoModel');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const path = require("path");
const { error } = require('console');

exports.register = async (req, res) => {
  const { username, email, password, confirmPassword, fullName } = req.body;

  try {
    if (password !== confirmPassword) {
      req.flash('error', 'As senhas não coincidem.');
      return res.redirect('/register');
    }

    const emailExists = await User.findOne({ where: { email } });
    const usernameExists = await User.findOne({ where: { username } });

    if (emailExists || usernameExists) {
      req.flash('error', 'Este e-mail ou usuário já está cadastrado.');
      return res.redirect('/register');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    req.flash('success', 'Conta criada com sucesso! Faça seu login.');
    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Erro ao criar conta. Verifique os dados e tente novamente.');
    return res.redirect('/register');
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: login },
          { username: login },
        ],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash('error', 'E-mail/Usuário ou senha incorretos.');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return res.redirect('/feed');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao tentar entrar.');
    return res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    return res.redirect('/');
  });
};

exports.getProfile = async (userId) => {
	try {
		return await User.findByPk(userId, {
			attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture']
		});
	} catch (error) {
		console.error(error);
		throw new Error('Erro ao buscar perfil do usuário.');
	}
};

exports.findByUsername = async (username) => {
	try {
		return await User.findOne({
			where: { username: username },
			attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture']
		});
	} catch (error) {
		console.error(error);
		throw new Error('Erro ao buscar perfil do usuário.');
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const { fullName, bio } = req.body;
		const userId = req.session.user.id;

		const updateData = { fullName, bio };

		// Se um arquivo foi enviado pelo Multer, ele estará em req.file
		if (req.file) {
			updateData.profilePicture = req.file.filename;
		}

		const user = await User.findByPk(userId);

		await User.update(updateData, { where: { id: userId } });

		if (req.file && user.profilePicture && user.profilePicture !== 'default-profile.png') {
			const oldProfilePicPath = path.join(_dirname, '../../public/uploads/profiles', user.profilePicture);
			fs.unlink(oldProfilePicPath, (err) => {
				if (err) console.error('Erro ao apagar foto de perfil antiga:', err);
				else console.log('Foto de perfil antiga apagada:', oldProfilePicPath);
			});
		}


		req.flash("success", "Perfil atualizado com sucesso.");
		// // res.redirect('/profile/edit');

	} catch (error) {
		console.error(error);
		req.flash('error', 'Erro ao atualizar perfil.');
		// // res.redirect('/profile/edit');
	}
};

exports.renderPublicProfile = async (req, res) => {
	try {
		const username = req.params.username;
		const user = await User.findOne({
			where: { username },
			include: [{
				model: Video,
				attributes: ["id", "title", "thumbnailPath", "views"],
				order: [["createdAt", "DESC"]]
			}],
			attributes: ["id", "username", "fullName", "bio", "profilePicture", "followersCount", "followingCount", "videosCount"]
		});

		if (!user) {
			req.flash("error", "Usuário não encontrado.");
			return // res.redirect("/feed");
		}

		// Verifica se o perfil sendo visualizado é o do usuário logado
		const isOwner = req.session.user && req.session.user.id === user.id;

		res.render("profile", { title: `@${user.username} | Shortz-App`, profileUser: user, isOwner });

	} catch (error) {
		console.error("Erro ao carregar perfil público:", error);
		req.flash("error", "Erro ao carregar o perfil. Tente novamente.");
		// res.redirect("/feed");
	}
};